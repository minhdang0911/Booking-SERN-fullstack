import { reject } from 'lodash';

class CommonUtils {
    static getBase64(file) {
        return new Promise((resolve, rejectFn) => {
            // Thay đổi tên của tham số reject thành rejectFn
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => rejectFn(error); // Sử dụng tên mới của hàm reject
        });
    }
}

export default CommonUtils;
