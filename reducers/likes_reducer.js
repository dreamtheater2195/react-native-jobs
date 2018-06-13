import { LIKE_JOB, CLEAR_LIKED_JOBS } from '../actions/types';
import _ from 'lodash';
export default function (state = [], action) {
    switch (action.type) {
        case LIKE_JOB:
            //return [...state.filter(job => job.id !== action.payload.id), action.payload];
            return _.uniqBy([action.payload, ...state], 'id');
        case CLEAR_LIKED_JOBS:
            return [];
        default:
            return state;
    }
}