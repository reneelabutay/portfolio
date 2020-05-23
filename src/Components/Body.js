import React, { Component } from 'react'
import Home from './Home'
import Projects from './Projects'
import Photography from './Photography'
import Recipes from './Recipes'
import GuestBook from './GuestBook'
import MovieGallery from './MovieGallery'



export class Body extends Component {
	displayContent = () => {
		var activeTab = this.props.activeTab
		if(activeTab===1)
			return <Home/>
		else if (activeTab===2)
			return <Projects/>
		else if (activeTab===3)
			return <Photography/>
		else if (activeTab===4)
			return <Recipes/>
		else if (activeTab===5)
			return <GuestBook/>
		else if (activeTab===6)
			return <MovieGallery/>
		else 
			return <Home/>
	}
  	render() {
	    return (
	    	this.displayContent()
	    );   
  	}
}
export default Body;