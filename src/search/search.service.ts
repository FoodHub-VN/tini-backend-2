import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { INTRODUCTION_MODEL, SERVICE_MODEL } from '../database/database.constants';
import { Service, ServiceModel } from '../database/model/service.model';
import { IntroductionModel } from '../database/model/introduction.model';
import { from, Observable } from 'rxjs';
import { Filter } from './interface/filter.interface';
import { Types } from 'mongoose';

const DOWN = [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, 2, 4, 6, 8];
const UP = [Number.MAX_SAFE_INTEGER, 2, 4, 6, 8, Number.MAX_SAFE_INTEGER];

@Injectable()
export class SearchService {
  constructor(
    @Inject(SERVICE_MODEL) private serviceModel: ServiceModel,
    @Inject(INTRODUCTION_MODEL) private introductionModel: IntroductionModel,
  ) {
  }

  quickSearch(textSearch: string): Observable<any> {
    const result: Array<any> = [];
    if (textSearch && textSearch.length > 2) {
      return from(this.serviceModel
        .find({
            $text: {
              $search: textSearch,
            },
          },
          { score: { $meta: 'textScore' } })
        .sort({ starPoint: 'desc' })
        .populate(['category', 'enterprise'])
        .exec(),
      );
    } else {
      return from(this.serviceModel.find().populate(['category', 'enterprise']).sort({ starPoint: 'desc' }).exec());
    }

  }

  async deepSearch(textSearch: string, filter: Filter, page: number | undefined) {
    if (filter.category && !Types.ObjectId.isValid(filter.category)) {
      throw new NotFoundException('Category not found: ' + filter.category);
    }
    try {
      let services: Array<Service> = [];
      let condition: any = {};
      let resultPerPage = 12;
      page = page || 1;
      filter.category && (condition['category'] = Types.ObjectId(filter.category));
      filter.quan && (condition['address.district'] = filter.quan);
      filter.huyen && (condition['address.village'] = filter.huyen);
      let down = 0;
      let up = 0;
      if (!filter.rating || filter.rating === -1) {
        down = 0;
        up = 0;
      } else {
        down = filter.rating;
        up = filter.rating;
      }
      // filter.rating && filter.rating!==-1 &&
      let totalPage = 1;
      if (textSearch && textSearch.length > 0) {
        if (!filter.rating || filter.rating === -1) { // all point
          services = await this.serviceModel.find({
            $text: {
              $search: textSearch,
            },
            $or: [
              {
                starPoint: {
                  $gte: DOWN[down],
                  $lte: UP[up],
                },
                ...condition,
              },{
                starPoint: null,
                ...condition,
              }
            ]
          }).sort({ starPoint: 'desc' })
            .skip((page - 1) * resultPerPage)
            .limit(resultPerPage)
            .populate(['category', 'enterprise'])
            .exec();
          totalPage = await this.serviceModel.find({
            $text: {
              $search: textSearch,
            },
            $or: [
              {
                starPoint: {
                  $gte: DOWN[down],
                  $lte: UP[up],
                },
                ...condition,
              },{
                starPoint: null,
                ...condition,
              }
            ]
          }).countDocuments().exec() / resultPerPage;
        } else {
          services = await this.serviceModel.find({
            $text: {
              $search: textSearch,
            },
            starPoint: {
              $gte: DOWN[down],
              $lte: UP[up],
              $ne: null,
            },
            ...condition,
          }).sort({ starPoint: 'desc' })
            .skip((page - 1) * resultPerPage)
            .limit(resultPerPage)
            .populate(['category', 'enterprise'])
            .exec();
          totalPage = await this.serviceModel.find({
            $text: {
              $search: textSearch,
            },
            starPoint: {
              $gte: DOWN[down],
              $lte: UP[up],
              $ne: null,
            },
            ...condition,
          }).countDocuments().exec() / resultPerPage;
        }
      } else {
        if (!filter.rating || filter.rating === -1) { // all point
          services = await this.serviceModel.find({
            $or: [
              {
                starPoint: {
                  $gte: DOWN[down],
                  $lte: UP[up],
                },
                ...condition,
              },
              {
                starPoint: null,
                ...condition,
              }],
          }, null)
            .sort({ starPoint: 'desc' })
            .skip((page - 1) * resultPerPage).limit(resultPerPage)
            .populate(['category', 'enterprise'])
            .exec();
          totalPage = await this.serviceModel.find({
            $or: [
              {
                starPoint: {
                  $gte: DOWN[down],
                  $lte: UP[up],
                },
                ...condition,
              },
              {
                starPoint: null,
                ...condition,
              }],
          }, null)
            .countDocuments()
            .exec() / resultPerPage;
        } else {
          services = await this.serviceModel.find({
            starPoint: {
              $gte: DOWN[down],
              $lte: UP[up],
              $ne: null,
            },
            ...condition,
          }, null)
            .sort({ starPoint: 'desc' })
            .skip((page - 1) * resultPerPage).limit(resultPerPage)
            .populate(['category', 'enterprise'])
            .exec();
          totalPage = await this.serviceModel.find({
            starPoint: {
              $gte: DOWN[down],
              $lte: UP[up],
              $ne: null,
            },
            ...condition,
          }, null)
            .countDocuments()
            .exec() / resultPerPage;
        }
      }
      return { services, totalPage: Math.ceil(totalPage), page };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
