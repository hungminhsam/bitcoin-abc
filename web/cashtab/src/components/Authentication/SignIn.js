import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { AuthenticationContext } from '@utils/context';
import {
    ThemedLockOutlined,
} from '@components/Common/CustomIcons';
import PrimaryButton from '@components/Common/PrimaryButton';
import { ReactComponent as FingerprintSVG } from '@assets/fingerprint-solid.svg';

const StyledSignIn = styled.div`
    h2 {
        color: ${props => props.theme.wallet.text.primary};
        font-size: 25px;
    }
    p {
        color: ${props => props.theme.wallet.text.secondary};
    }
`;

const UnlockButton = styled(PrimaryButton)`
    width: auto;
    margin: auto;
    padding: 20px 30px;

    svg {
        fill: ${props => props.theme.buttons.primary.color};
    }

    @media (max-width: 768px) {
        font-size: 16px;
        padding: 15px 20px;
    }
`;

const StyledFingerprintIcon = styled.div`
    width: 48px;
    height: 48px;
`;


const SignIn = () => {
    const authentication = useContext(AuthenticationContext);
    const [isVisible, setIsVisible] = useState(false);

    const handleDocVisibilityChange = () => {
        document.visibilityState === 'visible' ? setIsVisible(true) : setIsVisible(false);
    }

    const handleSignIn = async () => {
        try {
            await authentication.signIn();
        } catch (err) {
            Modal.error({
                title: 'Authentication Error',
                content: 'Cannot get Credential from your device',
                centered: true,
            });
        }
    }

    const handleSignInAndSuppressError = async () => {
        try {
            await authentication.signIn();
        } catch (err) {
            // fail silently
        }
    }

    useEffect(()=>{
        if (document.visibilityState === 'visible') {
            setIsVisible(true);
        }
        document.addEventListener('visibilitychange', handleDocVisibilityChange);

        return () => { document.removeEventListener('visibilitychange', handleDocVisibilityChange) };
    },[]);

    useEffect(()=>{
        // This will trigger the plaform authenticator as soon as the component becomes visible
        // (when switch back to this app), without any user gesture (such as clicking a button)
        // In platforms that require user gesture in order to invoke the platform authenticator,
        // this will fail. We want it to fail silently, and then show user a button to activate
        // the platform authenticator
        if (isVisible && authentication) {
            handleSignInAndSuppressError();
        }
    },[isVisible]);

    let signInBody;
    if (authentication) {
        signInBody =
            <div>
                <p>This wallet can be unlocked with your <strong>fingerprint / device pin</strong></p>
                <UnlockButton onClick={handleSignIn}>
                    <StyledFingerprintIcon>
                        <FingerprintSVG />
                    </StyledFingerprintIcon>
                    Unlock
                </UnlockButton>
            </div>
    } else {
        signInBody =  <p>Authentication is not supported</p>
    }

    return (
        <StyledSignIn>
            <h2>
                <ThemedLockOutlined /> Wallet Unlock
            </h2>
            {signInBody}
        </StyledSignIn>
    )
}

export default SignIn;