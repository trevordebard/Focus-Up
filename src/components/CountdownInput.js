import React, { useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import colors from '../constants/colors';

const Minutes = styled.p`
    color: ${colors.primary};
    font-size: 1.6em;
    font-weight: 530;
`;
const TimerInput = styled.input`
    font-size: 5em;
    font-weight: 500;
    color: ${colors.primary};
    width: 100px;
    border-style: none;
    text-align: center;
    margin: 0;
    ::placeholder {
        color: ${colors.primary};
        text-align: center;
        font-weight: 500;
    }
    :focus {
        outline: none;
    }
`;

const TimerContainer = styled.div`
    &:hover ${TimerInput}, &:hover ${Minutes} {
        color: ${colors.light_primary};
    }
    width: fit-content;
    display: inline-block;
`;

export default function CountdownInput({ time, setTime }) {
    const timerElement = useRef(null);
    return (
        <TimerContainer onClick={() => timerElement.current.focus()}>
            <TimerInput
                ref={timerElement}
                maxLength={2}
                type="text"
                value={time}
                onChange={e => {
                    // eslint-disable-next-line no-restricted-globals
                    if (!isNaN(e.target.value)) {
                        setTime(e.target.value);
                    }
                }}
                onFocus={e => {
                    e.target.value = '';
                }}
                onBlur={e => {
                    if (e.target.value === '') {
                        if (time === '') {
                            setTime(25);
                        }
                        e.target.value = time;
                    }
                }}
            />
            <Minutes>Minutes</Minutes>
        </TimerContainer>
    );
}

CountdownInput.propTypes = {
    setTime: PropTypes.func.isRequired,
    time: PropTypes.number,
};
CountdownInput.defaultProps = {
    time: 25,
};
