import React from 'react';
import Base from '../Base';

export default class Confirmation extends React.Component {
    
    static render() {
        return (
            <Confirmation/>
        );
    }
    
    render() {
        return (
            <Base nextText='Reset Form'>
                Confirmation
            </Base>
        );
    }
    
}
