import React, { Component } from 'react'
import Movie from './Movie'
import firebase from '../firebase'
import { FaSearch } from 'react-icons/fa'
import AddMovie from './AddMovie'


export class MovieGallery extends Component {
	constructor(){
		super();
		this.state = {
			searchTerm: '',
			movie_list: [], // list of movies that will be displayed
			// movieIDs: ["tt4501244", "tt3104988", "tt1570728", "tt5164432", "tt1632708",
			// "tt1045658", "tt1638002", "tt1564367", "tt7374948"]
			customLists: [],
			activeList: 'All'
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSearchMovie = this.handleSearchMovie.bind(this);
		//this.showDropdownMenu = this.showDropdownMenu.bind(this);
		this.getMenuContent = this.getMenuContent.bind(this);
		this.displayList = this.displayList.bind(this);

		
	}
	
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleSearchMovie(e) {
		e.preventDefault();
		const searchWord = this.state.searchTerm;
		const dataRef = firebase.database().ref('MovieList');
		dataRef.on('value', (snapshot) => {
			let movie_list = snapshot.val();
			let searchItems = [];
			for(let item in movie_list) {
				let currentTitle = movie_list[item].title
				if(currentTitle === searchWord) {
					//console.log("FOUND ITEM!")
					searchItems.push({
						movieID: movie_list[item].movieID,
						title: movie_list[item].title,
						director: movie_list[item].director,
						poster: movie_list[item].poster,
						imdbRating: movie_list[item].imdbRating,
						plot: movie_list[item].plot,
						rated: movie_list[item].rated,
					});
					break;
				}
			}
			this.setState({
				movie_list: searchItems
			})
		})
	}

	getMenuContent() {
		const dataRef = firebase.database().ref('Lists');
		dataRef.on('value', (snapshot) => {
			let lists = snapshot.val();
			let newListEntry = [];
			for (let item in lists) {
				newListEntry.push(lists[item].listName)
			}
			
			this.setState({
				customLists: newListEntry
			})
		});
	}

	componentDidMount() {
		const dataRef = firebase.database().ref('MovieList');
		dataRef.on('value', (snapshot) => {
			let movieData = snapshot.val();
			let newState = [];
			for(let item in movieData) {
				newState.push({ 
					movieID: movieData[item].movieID,
					title: movieData[item].title, 
					director: movieData[item].director,
					poster: movieData[item].poster,
					imdbRating: movieData[item].imdbRating,
					plot: movieData[item].plot,
					rated: movieData[item].rated,
				});
			}
			this.setState({
				movie_list: newState
			});
		});
		this.getMenuContent();
	}

	displayList(list) {
		//set movie list to this
		const listRef = firebase.database().ref('MovieListPairs');
		listRef.on('value', (snapshot) => {
			let pairs = snapshot.val();
			let listContent = [];
			for(let item in pairs) {
				if(pairs[item].listName === list) {
					listContent.push({
						movieID: pairs[item].movieID
					})
				}
			}
			this.setState({
				movie_list: listContent
			})
		});
		

	}

    render() {
		//console.log("this.state.movie_list")
		//console.log(this.state.movie_list)
		console.log("custom lists")
		console.log(this.state.customLists)
        return(
            <div> 
	    		<div className="page-body">
					<form className="movie-searchbar" onSubmit={this.handleSearchMovie}>
						<p className="search-movie">
							<input type="text" name="searchTerm" placeholder="Search for a Movie..."
							onChange={this.handleChange} value={this.state.searchTerm}></input>
							<button type="submit" className="movie-search-button">
								<FaSearch size={24}/>
							</button>
						</p>
					</form>
					<div>
						<div className="list-menu">
							{this.state.customLists.map((listItem) => {
										return <button className="list-btn" id={listItem} onClick={() => {this.displayList(listItem)}}>{listItem}</button>
							})}
						</div>
				
				
					</div>
					<div className="movie-body">
						{this.state.movie_list.map((movie) => {
							//console.log("this is the movie..")
							//console.log({movie})
							return <Movie id={movie}/>
						})}
					</div>
					<div>
						<AddMovie/>
					</div>
				</div>
	    	</div> 
        );
    }
}
export default MovieGallery;