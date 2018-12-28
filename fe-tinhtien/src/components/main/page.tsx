import React from "react";
import CreateActivityForm from "./createActivityform";
import {
  Button,
  ApplicationHeader,
  SizeContainer,
  SizeContainerElements,
  PieChart,
  Icon
} from "@com.mgmtp.a12/widgets";
import "../../css/main.css";
import logo from "../../images/logo.png";

const { Row, Column } = SizeContainerElements;

interface MainPageState {
  showForm: boolean;
}

export default class MainPage extends React.Component<{}, MainPageState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      showForm: false
    };
  }

  private showForm = () => {
    this.setState({ showForm: true });
  };

  private hideForm = () => {
    this.setState({ showForm: false });
  };

  render() {
    return (
      <div className="main">
        <ApplicationHeader leftSlots="TNT" className="header" />
        <SizeContainer noGutter>
          <Row alignment="center">
            <div className="top center">
              <img src={logo} className="center logo" />
              <h3 className="text-center text-main">
                Manage your team expenses
              </h3>
              <h4 className="text-center text-main">
                Easy to pay and get pay back money from team member
              </h4>
              <h4 className="text-center text-main">
                Hey, TinhTien is a shared expense manager for your activity.
                Start by creating your activity with the button below
              </h4>
              <Icon
                className="center text-center text-main"
                custom
                children={
                  <Icon className="text-center icon-small">arrow_downward</Icon>
                }
              />
              <div>
                {this.state.showForm ? (
                  <>
                    <CreateActivityForm />
                    <Button className="center" onClick={this.hideForm}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button className="center" onClick={this.showForm}>
                    <h3>START YOUR ACTIVITY HERE!</h3>
                  </Button>
                )}
              </div>
            </div>
          </Row>
          <Row>
            <div className="bottom center" id="bottom">
              <Row alignment="center">
                <Column size={{ sm: 2, md: 2, lg: 4 }}>
                  <Icon className="center text-center text-main icon">
                    alarm_on
                  </Icon>
                  <h3 className="text-center text-main">Save Time</h3>
                  <p className="text-center text-main">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Cupiditate nisi voluptate dolores non voluptatibus corporis
                    animi obcaecati rerum. Odio officiis aperiam similique
                    itaque delectus eos tempore id laudantium reprehenderit
                    quia!
                  </p>
                </Column>
                <Column size={{ sm: 2, md: 2, lg: 4 }}>
                  <Icon className="center text-center text-main icon">
                    book
                  </Icon>
                  <h3 className="text-center text-main">Be Transparency</h3>
                  <p className="text-center text-main">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Incidunt facere odit quisquam fugit maiores obcaecati ipsum
                    animi ad, possimus fuga fugiat pariatur quo a, cupiditate
                    officiis itaque in quos unde?
                  </p>
                </Column>
                <Column size={{ sm: 4, md: 2, lg: 4 }}>
                  <Icon className="center text-center text-main icon">
                    favorite
                  </Icon>
                  <h3 className="text-center text-main">Better Ralationship</h3>
                  <p className="text-center text-main">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Nisi in illo maxime, adipisci dicta corporis beatae id.
                    Animi quasi veritatis nisi quibusdam sequi tempore et
                    praesentium a, non error! Repudiandae.
                  </p>
                </Column>
              </Row>
            </div>
          </Row>
        </SizeContainer>
        <footer className="footer">
          <address>
            <p>Copyright 2018 © tinhtien.org. All rights reversed.</p>
          </address>
        </footer>
      </div>
    );
  }
}
