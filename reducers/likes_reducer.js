import { LIKE_JOB, CLEAR_LIKED_JOBS } from '../actions/types';
import _ from 'lodash';
import { REHYDRATE } from 'redux-persist/es/constants';
export default function (state = [], action) {
    switch (action.type) {
        case REHYDRATE:
            return action.payload.likes || [];
        case LIKE_JOB:
            //return [...state.filter(job => job.id !== action.payload.id), action.payload];
            return _.uniqBy([action.payload, ...state], 'id');
        case CLEAR_LIKED_JOBS:
            return [];
        default:
            return state;
    }
}