import React from 'react';
import { connect } from 'react-redux';

class Login extends React.Component {
    constructor(props) {
        super();
        this.state = {
            username: '',
            password: '',
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log(`submitted ${JSON.stringify(this.state)}`)
    }

    handleInputChange(target) {
        const {
            value,
            name,
        } = target;

        this.setState({
            [name]: value
        });
    } 

    render() {
        const {
            username,
            password,
        } = this.state;
        return <form onSubmit={e => this.handleSubmit(e)} className="login-form">
            <label>Username <input name="username" value={username} onChange={e => this.handleInputChange(e.target)}></input></label>
            <label>Password <input name="password" type="password" value={password} onChange={e => this.handleInputChange(e.target)}></input></label>
            <input type="submit" value="Login"/>
        </form>;
    }
}

const mapStateToProps = (state) => ({

});
const mapDispatchToProps = {

};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
