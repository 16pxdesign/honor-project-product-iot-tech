import React, {Component} from "react";
import {Container} from "react-bootstrap";

interface TestState {
    button: any
}
export class Test extends Component<{},TestState> {


    constructor(props: any) {
        super(props);
        this.state = { button: '' };
    }


    componentDidMount() {

    }

    render() {
        return (
            <Container>
                <h1>Test</h1>
                <input onChange={e => this.setState({ button: e.target.value })} value={this.state.button} />
                <button disabled={!this.state.button} >Button</button>
            </Container>
        );
    }

}
