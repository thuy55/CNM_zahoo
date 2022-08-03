import * as Yup from "yup"
export const validationRegister = Yup.object().shape({
    username: Yup.string()
        .min(4, "Quá ngắn")
        .max(8, "Quá dài")
        .required("Không được để trống"),
    phoneNumber: Yup.string()
        .matches(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 'Số điện thoại không hợp lệ')
        .required("Không được để trống"),
    password: Yup.string()
        .min(6, "Mật khẩu ít nhất 6 kí tự")
        .required("Không được để trống"),
    cf_password: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Mật khẩu không trùng khớp')
});
export const validateionCreateGroup = Yup.object().shape({
    label: Yup.string()
        .min(4, "Quá ngắn")
        .max(25, "Quá dài")
        .required("Không được để trống"),
   
});
export const validateionChangeGroupName = Yup.object().shape({
    label: Yup.string()
        .min(4, "Quá ngắn")
        .max(25, "Quá dài")
        .required("Không được để trống"),
   
});