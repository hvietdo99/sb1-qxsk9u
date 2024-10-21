import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { AssetService } from '../asset/asset.service';
import { UserService } from '../user/user.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    private assetService: AssetService,
    private userService: UserService
  ) {}

  async createOrder(userId: string, orderData: any): Promise<Order> {
    const newOrder = new this.orderModel({
      user: userId,
      ...orderData
    });
    return newOrder.save();
  }

  async getOrders(userId: string): Promise<Order[]> {
    return this.orderModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }

  async matchOrders(): Promise<void> {
    const buyOrders = await this.orderModel.find({ type: 'buy', status: 'open' }).sort({ price: -1 }).exec();
    const sellOrders = await this.orderModel.find({ type: 'sell', status: 'open' }).sort({ price: 1 }).exec();

    for (const buyOrder of buyOrders) {
      for (const sellOrder of sellOrders) {
        if (buyOrder.price >= sellOrder.price && buyOrder.cryptocurrency === sellOrder.cryptocurrency) {
          const matchedAmount = Math.min(buyOrder.amount, sellOrder.amount);
          
          // Create a new transaction
          const newTransaction = new this.transactionModel({
            buyOrder: buyOrder._id,
            sellOrder: sellOrder._id,
            amount: matchedAmount,
            price: sellOrder.price,
            status: 'pending'
          });
          await newTransaction.save();

          // Update order statuses
          buyOrder.amount -= matchedAmount;
          sellOrder.amount -= matchedAmount;

          if (buyOrder.amount === 0) buyOrder.status = 'matched';
          if (sellOrder.amount === 0) sellOrder.status = 'matched';

          await buyOrder.save();
          await sellOrder.save();

          // Create escrow
          await this.createEscrow(newTransaction._id);
        }
      }
    }
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true }).exec();
  }

  async createEscrow(transactionId: string): Promise<void> {
    const transaction = await this.transactionModel.findById(transactionId)
      .populate('sellOrder')
      .exec();

    if (!transaction) throw new Error('Transaction not found');

    const seller = await this.userService.findById(transaction.sellOrder.user);
    if (!seller || !seller.walletId) throw new Error('Seller not found');

    // Lock the funds in the seller's wallet
    await this.assetService.lockFunds(
      seller.walletId,
      transaction.sellOrder.cryptocurrency,
      transaction.amount.toString()
    );

    transaction.escrowId = `escrow-${transactionId}`;
    transaction.status = 'escrow_created';
    await transaction.save();
  }

  async releaseEscrow(transactionId: string): Promise<void> {
    const transaction = await this.transactionModel.findById(transactionId)
      .populate('buyOrder')
      .populate('sellOrder')
      .exec();

    if (!transaction) throw new Error('Transaction not found');

    const buyer = await this.userService.findById(transaction.buyOrder.user);
    const seller = await this.userService.findById(transaction.sellOrder.user);

    if (!buyer || !buyer.walletId || !seller || !seller.walletId) {
      throw new Error('Buyer or seller not found');
    }

    // Transfer funds from seller to buyer
    await this.assetService.transferFunds(
      seller.walletId,
      buyer.walletId,
      transaction.sellOrder.cryptocurrency,
      transaction.amount.toString()
    );

    transaction.status = 'completed';
    await transaction.save();
  }

  async checkFraud(userId: string, orderData: any): Promise<boolean> {
    // Implement basic fraud detection logic
    const userOrders = await this.orderModel.find({ user: userId }).sort({ createdAt: -1 }).limit(10).exec();
    
    // Check for rapid order creation
    const orderCount = userOrders.filter(order => 
      order.createdAt > new Date(Date.now() - 5 * 60 * 1000) // Orders in the last 5 minutes
    ).length;

    if (orderCount > 5) return true; // Potential fraud if more than 5 orders in 5 minutes

    // Check for large order amounts
    const averageAmount = userOrders.reduce((sum, order) => sum + order.amount, 0) / userOrders.length;
    if (orderData.amount > averageAmount * 10) return true; // Potential fraud if order amount is 10x the average

    return false; // No fraud detected
  }
}