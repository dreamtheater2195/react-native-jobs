import axios from 'axios';
import reverseGeocode from 'latlng-to-zip';
import qs from 'qs';
import {
    FETCH_JOBS_SUCCESS,
    FETCH_JOBS_FAIL,
    LIKE_JOB,
    CLEAR_LIKED_JOBS
} from './types';

const JOB_ROOT_URL = 'https://jobs.github.com/positions.json?';
const JOB_QUERY_PARAMS = {
    description: 'javascript',
    full_time: true
};

const buildJobsUrl = (zip) => {
    const query = qs.stringify({ ...JOB_QUERY_PARAMS, location: zip });
    return `${JOB_ROOT_URL}${query}`;
};

export const fetchJobs = (region, onSuccess, onError) => async dispatch => {
    try {
        let zip = await reverseGeocode(region);
        const url = buildJobsUrl(zip);
        console.log(url);
        let { data } = await axios.get(url);
        if (data) {
            dispatch({ type: FETCH_JOBS_SUCCESS, results: data });
            onSuccess();
        } else {
            throw new Error();
        }
    }
    catch (err) {
        const error = 'Failed to fetch jobs.';
        dispatch({ type: FETCH_JOBS_FAIL, error });
        onError(error);
    }
}

export const likeJob = (job) => {
    return {
        type: LIKE_JOB,
        payload: job
    }
}

export const clearLikedJobs = () => {
    return {
        type: CLEAR_LIKED_JOBS
    }
}