import { FETCH_JOBS_SUCCESS, FETCH_JOBS_FAIL } from '../actions/types';

const INITIAL_STATE = {
    results: [],
    error: ''
}
export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case FETCH_JOBS_SUCCESS:
            return { results: action.results, error: '' }
        case FETCH_JOBS_FAIL:
            return { results: [], error: action.error }
        default:
            return state;
    }
}