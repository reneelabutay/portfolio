import React, { Component } from 'react'
import firebase from '../firebase'
import { motion } from "framer-motion"

const guestFormVariants = {
	open: {opacity: 1, x:0},
	closed: {opacity: 0, x:-200},
}

const guestPostVariants = {
	open: {opacity: 1, x:0},
	closed: {opacity: 0, x:200},
}

export class GuestBook extends Component {
	// this is the way to save the data to the state of your 
	// class component
	constructor() {
		super();
		this.state = {
			name: '',
			description: '',
			email:'',
			viewable:'',
			message:'',
			data: []
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		const dataRef = firebase.database().ref('data')
		const item = {
			name: this.state.name,
			description: this.state.description,
			email: this.state.email,
			viewable: this.state.viewable,
			message: this.state.message,
			timestamp: new Date().toLocaleString(),
		}
		// Error Handler
		var errors = [];
		if (item.description.length >= 100) {
			errors.push("Description must be shorter than 100 characters.");
		}
		if (item.message.length <= 15 || item.message.length >= 500) {
			errors.push("Message must be shorter than 15 characters and ");
		} 
		if (errors.length > 0) {
			console.log(errors.length)
			alert("MESSAGE CANNOT BE SUBMITTED...\n".concat(errors.join("\n")))
			return;
		}

		dataRef.push(item);
		this.setState({
			name: '',
			description: '',
			email:'',
			viewable:'',
			message:''
		});
		alert("Your message has been submitted!");
	}
	componentDidMount() {
		const dataRef = firebase.database().ref('data');
		dataRef.on('value', (snapshot) => {
			let data = snapshot.val();
			let newState = [];
			for(let item in data) {
				if (data[item].viewable == "Yes") {
					newState.push({
						id: item,
						name: data[item].name,
						description: data[item].description,
						email: data[item].email,
						viewable: data[item].viewable,
						message: data[item].message,
						timestamp: data[item].timestamp
					});
				}
			}
			this.setState({
				data: newState
			});
		});
	}
	
	render() {
		return(
			<div>
				<div className="page-body">
				<div className="guest-book-body">
					<div className="guest-form">
						<h2 className="page-title">Leave me a message!</h2>
						<motion.div initial="closed" animate="open" variants={guestFormVariants}
								transition={{ duration: 0.75 }}>
							
						<form onSubmit={this.handleSubmit}>
							
							<p className="enter-name">
								<label>Your Name </label>
								<input type="text" name="name" pattern=".{6,20}"
								onChange={this.handleChange} value={this.state.name} 
								required title="Name must be longer than 5 characters and less than 20 characters."></input>
							</p>
							<p className="enter-bio">
								<label>Short Description of Yourself</label>
								<textarea name="description" rows="2" placeholder="Optional" maxLength={100}
								onChange={this.handleChange} value={this.state.description}></textarea>
							</p>
							<p className="enter-email">
								<label>Email </label>
								<input type="email" name="email" placeholder="Optional"
								onChange={this.handleChange} value={this.state.email}></input>
							</p>
							<p className="enter-viewable">
								<label for="viewable">Would you like your message to be viewable by other guests?</label>
								<select required id="viewable" name="viewable" onChange={this.handleChange} value={this.state.viewable}>
									<option value="">-Select-</option>
									<option value="Yes">Yes</option>
									<option value="No">No</option>
								</select>
							</p>
							
							<p className="enter-message">
								<label>Message </label>
								<textarea name="message" rows="3" required 
								onChange={this.handleChange} value={this.state.message}></textarea>
							</p>
							<motion.button 
								whileHover={{scale:1.1}}
								whileTap={{scale:0.9}}>
							<div className="enter-submit">
								<button className="submit-button">Submit</button>
							</div>
							</motion.button>
						</form>
						</motion.div>
					</div>
					<div className="guest-book-display">
						<h2 className="page-title">Messages</h2>
						<motion.div initial="closed" animate="open" variants={guestPostVariants}
								transition={{ duration: 0.75 }}>
						<ul>
							{this.state.data.map((item) => {
								return (
									
									<li className="indPost" key={item.id}>
										<p className="guest-name">{item.name}</p>
										<p className="guest-bio">{item.description}</p>
										<p className="guest-message">{item.message}</p>
										<p className="guest-timestamp">{item.timestamp}</p>
									</li>
									
								)
							})}
						</ul>
						</motion.div>

					</div>
				</div>
				</div>	
			</div>
		); 
		
	}
}

export default GuestBook;