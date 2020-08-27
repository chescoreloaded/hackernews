import React , { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP='100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE='page=';
const PARAM_HPP='hitsPerPage=';


// function isSearched(searchTerm){
//   return function(item){
//     return item.title.toLowerCase().includes(searchTerm.toLowerCase());
//   }
// }


class App extends Component {
    constructor(props){
      super(props);
      this.state = {
        result: null,
        searchTerm: DEFAULT_QUERY,
      };

      this.setSearchTopStories.bind(this);
      this.onDismiss = this.onDismiss.bind(this);
      this.onSearchChange = this.onSearchChange.bind(this);
      this.onSearchSubmit=this.onSearchSubmit.bind(this);
      this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    }
    setSearchTopStories(result){


      const {hits, page}=result;
      
      const oldHits = page !==0 ? this.state.result.hits : [];
      const updatedHits = [...oldHits, ...hits];

      this.setState({result: {hits:updatedHits,page}});
    }

    onDismiss(id){     
      const isNotId =  item=>item.objectID !== id;
      const updatedHits = this.state.result.hits.filter(isNotId);
      this.setState({
        //result: Object.assign({},this.state.result, {hits:updatedHits})
      result: {...this.state.result, hits:updatedHits}

      });
    }

    onSearchChange(event){
      this.setState({searchTerm: event.target.value});
    }
    onSearchSubmit(event){
      const {searchTerm} = this.state;
      this.fetchSearchTopStories(searchTerm);

      event.preventDefault();
    }
    fetchSearchTopStories(searchTerm, page=0){
        let url =`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`;
        console.log(url);
        fetch(url)
        .then(response=>response.json())
        .then(result=> this.setSearchTopStories(result))
        .catch(error=>error);
    }

      render(){
      const {searchTerm, result} = this.state;
      const page= (result && result.page) || 0;
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

                {result &&
                <Table
                list={result.hits}
                // pattern={searchTerm}
                onDismiss={this.onDismiss}
                />
                }
                <div className="interactions">
                   <Button onClick={()=>this.fetchSearchTopStories(searchTerm,page+1)}>
                     More
                   </Button> 
                </div>

          </div>
          );
      
      }

      componentDidMount(){
        const {searchTerm}= this.state;
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
