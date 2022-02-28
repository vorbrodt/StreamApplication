import React from "react";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";

class GoogleAuth extends React.Component {
  componentDidMount() {
    //second argument is a callback which only will be called once the
    //client:auth2 library has been loaded up into gapi
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          //init will make an async request to server to init client
          clientId:
            "312805178822-0iqscdi8ttj1rj8li21qk765lma3p5u3.apps.googleusercontent.com",
          scope: "email",
        })
        .then(() => {
          //"then" is for when init is done
          this.auth = window.gapi.auth2.getAuthInstance(); //save instance of user
          this.onAuthChange(this.auth.isSignedIn.get());
          //event listener that listens to changes in isSignedIn
          this.auth.isSignedIn.listen(this.onAuthChange);
        });
    });
  }

  onAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      this.props.signIn(this.auth.currentUser.get().getId());
    } else {
      this.props.signOut();
    }
  };

  onSignInClick = () => {
    this.auth.signIn();
  };
  onSignOutClick = () => {
    this.auth.signOut();
  };

  renderAuthButton() {
    if (this.props.isSignedIn === null) {
      return null;
    } else if (this.props.isSignedIn) {
      return (
        <button className="ui red google button" onClick={this.onSignOutClick}>
          <i className="google icon" />
          Sign Out
        </button>
      );
    } else {
      return (
        <button className="ui red google button" onClick={this.onSignInClick}>
          <i className="google icon" />
          Sign In
        </button>
      );
    }
  }

  //gapi.auth2.getAuthInstance().signIn() to sign in
  //gapi.auth2.getAuthInstance().signOut() to sign out
  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);
