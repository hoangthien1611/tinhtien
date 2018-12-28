import React, { Component } from 'react';
import '../css/Welcome.css';

class Welcome extends Component<{}, {nameActivity: string}>{
    constructor(props:string){
        super(props);
        this.state={
            nameActivity:""
        };
    }

    async componentDidMount(): Promise<void>{
        let link=window.location.href
        this.getNameActivity(link.substring(link.lastIndexOf("/")))
        console.log(link)
    }

    async getNameActivity( hashUrl:string):Promise<void>{
        try{
            const url :string = "api/activity/"+hashUrl;
            const result = await fetch(url);
            const activityName = (await result.json()) ;
            console.log(activityName["name"])
            this.setState({nameActivity:activityName["name"]});
        }
        catch(error){
            console.log(error)
        }
    }

    render(){
        return(
            <div>
                <div className="welcome_form">
                    <div className="header">
                        <h2>Welcome to <span className="h2_nameActivity">{this.state.nameActivity}</span></h2>
                        <h3>Invite participants</h3>
                        <h4>Share to friends to join in the activity with the link !</h4>
                    </div>
                </div>
            </div>
        );
    }

}
export default Welcome; 
