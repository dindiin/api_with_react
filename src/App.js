import React, { Component } from 'react';
import axios from "axios";

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      dataApi : [],
      edit:false,
      dataPost: {
        id:0,
        title:'',
        body:''
      }
    };
    this.handleRemove=this.handleRemove.bind(this);
    this.inputChange=this.inputChange.bind(this);
  }

  reloadData(){
    axios.get('http://localhost:3004/posts').then(
      res => {
        this.setState({
          dataApi: res.data,
          edit: false
        })
      }
    );
  }

  handleRemove(e){
    console.log(e.target.value);
    fetch(`http://localhost:3004/posts/${e.target.value}`, {method:"DELETE"}).then(res=>this.reloadData());
  }

  inputChange(e) {
    let newdataPost = {...this.state.dataPost};
    if(this.state.edit===false){
      newdataPost['id'] = new Date().getTime();
    }
    newdataPost[e.target.name] = e.target.value;

    this.setState({
      dataPost: newdataPost
    },()=>console.log(this.state.dataPost));
  }

  clearData=()=>{
    let newdataPost = {...this.state.dataPost};

      newdataPost['id']="";
      newdataPost['body']="";
      newdataPost['title']="";

      this.setState({
        dataPost : newdataPost
      });
  }

  onSubmitForm = () => {
    if(this.state.edit === false) {
    axios.post(`http://localhost:3004/posts`, this.state.dataPost).then(()=>{
      this.reloadData();
      this.clearData();
    });
    } else {
      axios.put(`http://localhost:3004/posts/${this.state.dataPost.id}`, this.state.dataPost).then(()=>{
        this.reloadData();
        this.clearData();
      })
    }
  }

  getDataId=(e) => {
    axios.get(`http://localhost:3004/posts/${e.target.value}`).then(res=> {
      this.setState({
        dataPost:res.data,
        edit: true
      })
    });
  };

  componentDidMount() {
    // Cara 1 menggunakan fetch

    // fetch('https://jsonplaceholder.typicode.com/posts')
    // .then(response => response.json())
    // .then(res => {
    //   this.setState({
    //     dataApi: res
    //   })
    // });

    // Cara 2 menggunakan axios
    this.reloadData();
  }

  render() {
    return (
      <div>
        <p>Hello API</p>
        <input type='text' name='body' value={this.state.dataPost.body} placeholder='Masukkan Body' onChange={this.inputChange} />
        <input type='text' name='title' value={this.state.dataPost.title} placeholder='Masukkan Title' onChange={this.inputChange} />
        <button type='submit' onClick={this.onSubmitForm}>Save</button>

        {this.state.dataApi.map((dat, index) =>{
          return(
            <div key={index}>
              <p>{dat.title}</p>
              <button value={dat.id} onClick={this.handleRemove}>Delete</button>
              <button value={dat.id} onClick={this.getDataId}>Edit</button>
            </div>
          );
        })}
      </div>
    );
  }
}

export default App;
