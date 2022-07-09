import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { USER_MODEL } from '../database/database.constants';
import { UserModel } from '../database/model/user.model';
import { AuthReqInterface } from '../auth/interface/auth-req.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_MODEL) private userModel: UserModel,
  ) {
  }

  async fetchUserById(id: number) {
    return this.userModel.findById(id).exec();
  }

  async followUser(req: AuthReqInterface, userId: number) {
    try {
      let user = await this.userModel.findOne({ _id: req.user.customer_id }).exec();
      let userFollow = await this.userModel.findOne({ _id: userId }).exec();
      if (!user || !userFollow) {
        throw new NotFoundException('User not found!');
      }
      let following = user.following.filter(u => u != userId);
      following.push(userId);

      let follower = userFollow.follower.filter(u => u != user._id);
      follower.push(user._id);

      await user.update({ following }).exec();
      await userFollow.update({ follower }).exec();
      return true;
    } catch (e) {
      throw e;
    }
  }

  async unFollowUser(req: AuthReqInterface, userId: number){
    try {
      let user = await this.userModel.findOne({ _id: req.user.customer_id }).exec();
      let userUnFollow = await this.userModel.findOne({ _id: userId }).exec();
      if (!user || !userUnFollow) {
        throw new NotFoundException('User not found!');
      }
      let following = user.following.filter(u => u != userId);

      let follower = userUnFollow.follower.filter(u => u != user._id);

      await user.update({ following }).exec();
      await userUnFollow.update({ follower }).exec();
      return true;
    } catch (e) {
      throw e;
    }
  }
}
