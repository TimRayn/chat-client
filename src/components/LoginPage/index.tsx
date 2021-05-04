import { FC, FormEvent, useState } from 'react';
import { User } from '../../api/models/User';
import { login } from '../../api/user.service';
import './styles.scss';

export type LoginPageProps = {
    onLogin: (user: User) => void;
}

const LoginPage: FC<LoginPageProps> = ({ onLogin }) => {
    const [nickname, setNickname] = useState<string>('');
    const [loginLocked, setLoginLocked] = useState<boolean>(false);
    const [loginError, setLoginError] = useState('')

    const handleLogin = async (e: FormEvent) => {
        setLoginLocked(true);
        e.preventDefault();
        if (!nickname) return;
        try {
            const user = await login(nickname);
            onLogin(user);
        } catch (e) {
            setLoginError(e.toString());
            setLoginLocked(false);
        }
    };

    return (
        <div className='login-page-container'>
            <form onSubmit={(e) => handleLogin(e)}>
                <input
                    autoFocus
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)} />
                <button type='submit' disabled={loginLocked}>Login</button>
                {loginError && <p>{loginError}</p>}
            </form>
        </div>
    );
};

export default LoginPage;