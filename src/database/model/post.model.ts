import {Document, Model, Schema, SchemaTypes} from 'mongoose';

interface Post extends Document {
  readonly owner: string;
  readonly title: string;
  readonly content: string;
  readonly images: string[];
  readonly hashtag: string[];
  readonly upVotedBy: number[];
  readonly downVotedBy: number[];
  readonly numView: number;
  readonly comment: string[];
  readonly visitedTime: number;
  readonly rating: number;
  readonly lat: string;
  readonly lng: string;
  readonly locationName: string;
  readonly locationId: string;
}

type PostModel = Model<Post>;

const PostSchema = new Schema<Post>({
  owner: {
    type: SchemaTypes.Number,
    ref: 'User'
  },
  title: {
    type: SchemaTypes.String,
    text: true
  },
  content: {
    type: SchemaTypes.String,
    text: true
  },
  images: [SchemaTypes.String],
  hashtag: [SchemaTypes.String],
  upVotedBy: [{
    type: SchemaTypes.Number,
    ref: 'User',
  }],
  downVotedBy: [{
    type: SchemaTypes.Number,
    ref: 'User',
  }],
  numView: SchemaTypes.Number,
  comment: [{
    type: SchemaTypes.ObjectId,
    ref: 'Comment',
  }],
  visitedTime: SchemaTypes.Number,
  rating: SchemaTypes.Number,
  lat: SchemaTypes.String,
  lng: SchemaTypes.String,
  locationName: SchemaTypes.String,
  locationId: SchemaTypes.String
}, {
  timestamps: true,
});

// async function preSaveHook(next) {
//   // Only run this function if password was modified
//   if (!this.isModified('password')) return next();
//
//   // Hash the password
//   const password = await hash(this.password, 12);
//   this.set("password", password);
//
//   next();
// }
//
// async function postDeleteHook(user) {
//   //delete all comment
//   const comments = this.model;
// }
//
//
// UserSchema.pre<User>("save", preSaveHook);
// UserSchema.post<User>("remove", async function(user) {
//     //delete comment
//     const comments = await this.model<CommentModel>("Comment").find({ user: this._id }).exec();
//     comments&&await Promise.all(comments.map((comment) => {
//         return comment.remove();
//     }));
//
//     //delete notification
//
//     const notis = await this.model<NotificationModel>("Notification").find({ user: this._id }).exec();
//     notis&&await Promise.all(notis.map((noti) => {
//         return noti.remove();
//     }));
//
//     //delete schedule history
//
//     const scheduleHistories = await this.model<ScheduleHistoryModel>("ScheduleHistory").find({ user: this._id }).exec();
//     scheduleHistories&&await Promise.all(scheduleHistories.map((scheduleHistory) => {
//         return scheduleHistory.remove();
//     }));
//
//     //delete purchase history
//     const purchaseHistories = await this.model<PurchaseModel>("Purchase").find({ user: this._id }).exec();
//     purchaseHistories&&await Promise.all(purchaseHistories.map((purchaseHistory) => {
//         return purchaseHistory.remove();
//     }));
//
//     //delete schedule
//
//     const schedules = await this.model<ScheduleModel>("Schedule").find({ user: this._id}).exec();
//     schedules&&await Promise.all(schedules.map((schedule) => {
//         return schedule.remove();
//     }))
//     return;
// });
// function comparePasswordMethod(password: string): Observable<boolean> {
//   return from(compare(password, this.password));
// }


// UserSchema.methods.comparePassword = comparePasswordMethod;

export {
  Post,
  PostModel,
  PostSchema,
};
