import React , { Component } from 'react';
import axios from 'axios';
import './App.css';
import {DEFAULT_QUERY
        ,DEFAULT_HPP
        ,PATH_BASE
        ,PATH_SEARCH
        ,PARAM_SEARCH
        ,PARAM_PAGE
        ,PARAM_HPP} from '../src/constants/'




// function isSearched(searchTerm){
//   return function(item){
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// }


class App extends Component {
    constructor(props){
      super(props);
      this.state = {
        results: null,
        searchKey: '',
        searchTerm: DEFAULT_QUERY,
        error: null,
      };

      this.setSearchTopStories.bind(this);
      this.onDismiss = this.onDismiss.bind(this);
      this.onSearchChange = this.onSearchChange.bind(this);
      this.onSearchSubmit=this.onSearchSubmit.bind(this);
      this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
      this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    }

    needsToSearchTopStories(searchTerm){
      return !this.state.results[searchTerm];
    }

    setSearchTopStories(result){


      const {hits, page}=result;
      const {searchKey, results}= this.state;
      
      // const oldHits = page !==0 ? this.state.result.hits : [];
      const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
      const updatedHits = [...oldHits, ...hits];

      this.setState({results: {...results, [searchKey]:{hits:updatedHits,page}}});
    }

    onDismiss(id){

      const {searchKey, results}= this.state;
      const {hits, page}= results[searchKey];

      const isNotId =  item=>item.objectID !== id;
      const updatedHits = hits.filter(isNotId);

      //const updatedHits = this.state.result.hits.filter(isNotId);
      this.setState({
        //result: Object.assign({},this.state.result, {hits:updatedHits})
      results: {
        ...results, [searchKey]:{hits:updatedHits,page}
      }

      });
    }

    onSearchChange(event){
      this.setState({searchTerm: event.target.value});
    }
    onSearchSubmit(event){
      const {searchTerm} = this.state;
      this.setState({searchKey:searchTerm});
      if(this.needsToSearchTopStories(searchTerm)){
          this.fetchSearchTopStories(searchTerm);    
      }

      event.preventDefault();
    }
    fetchSearchTopStories(searchTerm, page=0){

        let url =`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
        console.log(url);
        axios(url)
        // .then(response=>response.json())
        .then(result=> this.setSearchTopStories(result.data))
        .catch(error=>this.setState({error}));
    }

      render(){

      const {searchTerm, 
             results,
             searchKey,
             error } = this.state;
      const page= (
            results && 
            results[searchKey] &&
            results[searchKey].page) 
            || 0;
      const list = (results &&
                    results[searchKey] &&
                    results[searchKey].hits)
            || [];
        return ( 
          <div className="page">
            <div className="interactions">
              <Search
               value={searchTerm}
               onChange ={this.onSearchChange}
               onSubmit = {this.onSearchSubmit}
              >
              Search
              </Search>

            </div>


                {error ?
                  <div className="interactions">
                    <p>Something went wrong.</p>
                  </div>
                : <Table
                list={list}
                // pattern={searchTerm}
                onDismiss={this.onDismiss}
                /> 
                }       
                <div className="interactions">
                   <Button onClick={()=>this.fetchSearchTopStories(searchKey,page + 1)}>
                     More
                   </Button> 
                </div>

          </div>
          );
      
      }

      componentDidMount(){
        const {searchTerm}= this.state;
        this.setState({searchKey:searchTerm});
        this.fetchSearchTopStories(searchTerm);


      }
}


// class Search extends Component{
//   render(){
//     const {value, onChange, children}= this.props;
//     return (
//       <form>
//         {children}
//         <input type="text"
//                value ={value}
//                onChange={onChange}
//         />

//       </form>
//     );
//   }
// }

// class Table extends Component{
//   render(){
//     const {list,pattern,onDismiss}=this.props;

//     return(
//       <div>
//         {list.filter(isSearched(pattern)).map(item =>
//           <div key={item.objectID}>
//             <span>{ <a href={item.url}>{item.title}</a> }</span>
//             <span>{item.author}</span>
//             <span>{item.num_comments}</span>
//             <span>{item.points}</span>
//             <span>
//             <Button
//             onClick={()=>onDismiss(item.objectID)}
//             >
//               Dismiss
//             </Button>
//             </span>            
//           </div>  
//         )}
//         </div>

//       );
//   }
// }

// class Button extends Component{
//   render(){
//     const {onClick,className='',children} = this.props;
//     return (
//         <button
//         onClick={onClick}
//         className={className}
//         type ="button"
//         >
//           {children}
//         </button>
//       );
//   }
// }


const Search = ( {value,onChange,onSubmit,children}) => 
      <form onSubmit={onSubmit}>
        {children}
        <input type="text"
               value ={value}
               onChange={onChange}
        />
        <button
        type="submit"        
        >
        {children}
        </button>
      </form>

const Table = ({list,onDismiss})=>
      <div className="table">
        {list.map(item =>
        // {list.filter(isSearched(pattern)).map(item =>
          <div key={item.objectID} className="table-row">
            <span style={{width: '40%'}}>{ <a href={item.url}>{item.title}</a> }</span>
            <span style={{width: '30%'}}>{item.author}</span>
            <span style={{width: '10%'}}>{item.num_comments}</span>
            <span style={{width: '10%'}}>{item.points}</span>
            <span style={{width: '10%'}}>
            <Button
            onClick={()=>onDismiss(item.objectID)}
            className="button-inline"
            >
              Dismiss
            </Button>
            </span>            
          </div>  
        )}
        </div>
  
const Button = ({onClick,className='',children})=>
        <button
        onClick={onClick}
        className={className}
        type ="button"
        >
          {children}
        </button>

  
export default App;
export {Button,
        Search,
        Table,
      };
