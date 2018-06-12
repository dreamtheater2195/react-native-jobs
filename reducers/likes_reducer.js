import { LIKE_JOB } from '../actions/types';
import _ from 'lodash';

export default function (state = [], action) {
    switch (action.type) {
        case LIKE_JOB:
            //return [...state.filter(job => job.id !== action.payload.id), action.payload];
            return _.uniqBy([action.payload, ...state], 'id');
        default:
            return state;
    }
}