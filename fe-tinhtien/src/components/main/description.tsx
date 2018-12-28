import React from "react";
import { Icon } from "@com.mgmtp.a12/widgets";
import { AppDescription } from "../../models/AppDescription";
import { CSSTransition, TransitionGroup } from "react-transition-group";

interface DescriptionProp extends AppDescription {}

export default class Description extends React.Component<DescriptionProp, {}> {
  constructor(props: DescriptionProp) {
    super(props);
  }

  render() {
    return (
      <TransitionGroup>
        <CSSTransition classNames="slide" timeout={1000}>
          <div className="description">
            <Icon className="center text-center icon">{this.props.icon}</Icon>
            <h2 className="text-center text-main title">{this.props.title}</h2>
            <h3 className="text-center text-main">{this.props.description}</h3>
          </div>
        </CSSTransition>
      </TransitionGroup>
    );
  }
}
