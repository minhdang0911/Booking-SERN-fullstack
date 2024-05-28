import actionTypes from '../actions/actionTypes';

const initialState = {
    genders: [],
    roles: [],
    positions: [],
    users: [],
    topDoctors: [],
    allDoctors: [],
    allScheduleTime: [],
    isLoadingGender: false,
    allRequiredDoctorInfor: [],
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_GENDER_START:
            return {
                ...state,
                isLoadingGender: true,
            };

        case actionTypes.FETCH_GENDER_SUCCESS:
            return {
                ...state,
                genders: action.data,
                isLoadingGender: false,
            };

        case actionTypes.FETCH_GENDER_FAIDED:
            return {
                ...state,
                isLoadingGender: false,
                genders: [],
            };

        case actionTypes.FETCH_POSITION_SUCCESS:
            return {
                ...state,
                positions: action.data,
            };

        case actionTypes.FETCH_POSITION_FAIDED:
            return {
                ...state,
                positions: [],
            };

        case actionTypes.FETCH_ROLE_SUCCESS:
            return {
                ...state,
                roles: action.data,
            };

        case actionTypes.FETCH_ROLE_FAIDED:
            return {
                ...state,
                roles: [],
            };

        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            return {
                ...state,
                users: action.users,
            };

        case actionTypes.FETCH_ALL_USERS_FAIDED:
            return {
                ...state,
                users: [],
            };

        case actionTypes.FETCH_TOP_DOCTOR_SUCCESS:
            return {
                ...state,
                topDoctors: action.dataDoctors,
            };

        case actionTypes.FETCH_TOP_DOCTOR_FAILDED:
            return {
                ...state,
                topDoctors: [],
            };
        case actionTypes.FETCH_ALL_DOCTOR_SUCCESS:
            return {
                ...state,
                allDoctors: action.dataDr,
            };

        case actionTypes.FETCH_ALL_DOCTOR_FAILDED:
            return {
                ...state,
                allDoctors: [],
            };

        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
            return {
                ...state,
                allScheduleTime: action.dateTime,
            };

        case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILDED:
            return {
                ...state,
                allScheduleTime: [],
            };

        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_SUCCESS:
            return {
                ...state,
                allRequiredDoctorInfor: action.data,
            };

        case actionTypes.FETCH_REQUIRED_DOCTOR_INFOR_FAILED:
            return {
                ...state,
                allRequiredDoctorInfor: [],
            };

        default:
            return state;
    }
};

export default adminReducer;
