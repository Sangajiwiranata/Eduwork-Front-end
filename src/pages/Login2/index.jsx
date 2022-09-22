import React from 'react'
import { Form, Button, Card, Container } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { loginUser } from '../../app/api/auth'
import { userLogin } from '../../app/features/Auth/actions'
import { useHistory } from 'react-router'
import '../Login2/style.css'

const schema = yup.object({
    email: yup.string().email('Email harus valid').required('Email harus diisi'),
    password: yup.string().min(8, 'Password minimal 8 karakter').required('Password harus diisi')
}).required();

const statusList = {
    idle: 'idle',
    process: 'process',
    success: 'success',
    error: 'error'
}

export default function Login2() {
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(schema)
    });
    const [status, setStatus] = React.useState(statusList.idle);
    const dispatch = useDispatch();
    const history = useHistory();

    const onSubmit = async formData => {
        setStatus(statusList.process);
        const { data } = await loginUser(formData);
        if (data.error) {
            setError('password', { type: 'invalidCredential', message: data.message });
            setStatus(statusList.error)
        } else {
            const { user, token } = data;
            dispatch(userLogin({ user, token }));
            history.push('/');
        }
        setStatus(statusList.success);
    }

    return (
        <Container className="main">
            <Container className='body-cont '>
                <h1>Login Page</h1>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3 form-login" controlId="formBasicEmail">
                        <Form.Label>Alamat Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            isInvalid={errors.email}
                            {...register('email')}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email?.message}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            isInvalid={errors.password}
                            {...register('password')}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password?.message}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={status === statusList.process}>
                        {status === statusList.process ? 'Memprosess...' : 'Login'}
                    </Button>
                </Form>
            </Container>
        </Container>
    )
}
