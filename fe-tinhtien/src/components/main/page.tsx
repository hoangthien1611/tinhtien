import React from "react";
import CreateActivityForm from "./createActivityform";
import { AppDescription } from "../../models/AppDescription";
import Description from "./description";
import {
  Button,
  ApplicationHeader,
  SizeContainer,
  SizeContainerElements,
  Icon,
  ButtonGroup
} from "@com.mgmtp.a12/widgets";
import { CSSTransition } from "react-transition-group";
import "../../css/main.css";
import minorLogo from "../../images/minor_logo.png";
import mainLogo from "../../images/main_logo.png";
import data from "./description.json";

const { Row } = SizeContainerElements;

interface MainPageState {
  showForm: boolean;
  descriptionData: AppDescription;
}

export default class MainPage extends React.Component<{}, MainPageState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      showForm: false,
      descriptionData: data[0]
    };
    setInterval(this.nextDescription, 5000);
  }

  private showForm = () => {
    this.setState({ showForm: true });
  };

  private hideForm = () => {
    this.setState({ showForm: false });
  };

  private nextDescription = () => {
    const curIndex = data.indexOf(this.state.descriptionData);
    this.setState({
      descriptionData: data[curIndex < data.length - 1 ? curIndex + 1 : 0]
    });
  };

  private prevDescription = () => {
    const curIndex = data.indexOf(this.state.descriptionData);
    this.setState({
      descriptionData: data[curIndex > 0 ? curIndex - 1 : data.length - 1]
    });
  };

  render() {
    const { descriptionData } = this.state;
    return (<>
      <div className="main">
          <ApplicationHeader
            leftSlots={[
              <a href="#">
                <img src={minorLogo} />
              </a>,
              <p>TinhTien</p>
            ]}
            rightSlots={<p>Manage team expenses</p>}
            className="header"
          />
          <SizeContainer noGutter>
            <Row>
              <div className="top center">
                <img src={mainLogo} className="center" />
                <h3 className="text-center text-main">
                  Hey, TinhTien is a shared expense manager for your activity.
                </h3>
                <div>
                  {this.state.showForm ? (
                    <>
                      <CreateActivityForm />
                      <Button className="center" onClick={this.hideForm}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button className="center text-main" onClick={this.showForm}>
                      <h3>START YOUR ACTIVITY HERE!</h3>
                    </Button>
                  )}
                </div>
              </div>
            </Row>
            <Row>
              <div className="center">
                <CSSTransition
                  classNames="fade"
                  timeout={1000}
                  in={true}
                  appear={true}
                >
                  <Description {...descriptionData} />
                </CSSTransition>
              </div>
            </Row>
            <Row>
              <ButtonGroup className="center">
                <Button
                  iconButton
                  icon={<Icon>navigate_before</Icon>}
                  title="Back"
                  secondary
                  onClick={this.prevDescription}
                />
                <Button
                  iconButton
                  icon={<Icon>navigate_next</Icon>}
                  title="Next"
                  secondary
                  onClick={this.nextDescription}
                />
              </ButtonGroup>
            </Row>
          </SizeContainer>
        </div>
        <footer className="footer">
          <address>
            <p>Copyright 2018 © mgm. All rights reversed.</p>
          </address>
        </footer>
        </>
    );
  }
}
