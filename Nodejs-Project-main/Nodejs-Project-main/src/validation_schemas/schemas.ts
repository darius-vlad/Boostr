import * as yup from 'yup'

const schemas =
    {
        userSchema: yup.object(
            {
                name: yup.string().required('Name is required for creating an account!'),
                email: yup.string().required('Email is required for creating an account!').email('Invalid email format'),
                password: yup.string().required('Password required!').min(8, 'Password must be at least 8 characters!'),
            }
        )
    }

export default schemas