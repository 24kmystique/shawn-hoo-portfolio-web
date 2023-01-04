import React, { Component } from 'react';
import './CSS/AboutPage.css';
import InformationDataService from '../Services/InformationDataService'
class About extends Component {

    constructor(props){
        super(props);

        this.state = {aboutContent:""};
    }

    componentDidMount(){


        const getAbout = async() =>{
            InformationDataService.getAboutPost()
            .then(response => {
                this.setState({aboutContent:response.data[0].content});
                // console.log(response.data[0]._id);
            })
            .catch(e => {
                console.log(e)
            });
        }
    
        // getPosts();
        getAbout();
    }



    render() {    
        return (
            <p className="bodyStyle">
                {this.state.aboutContent}
            </p>
        )
    }
}

export default About;

