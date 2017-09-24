var DisplayContainer1 = React.createClass({
	updateValue:function(modifiedValue){
		this.setState({
			value:modifiedValue
		})
	},
	getInitialState:function(){
		return{
			value:'My Value'
		}
	},
	render:function(){
		return (
			<div className="DisplayContainer">
				<h3>{this.state.value}</h3>
				<InputBox1 value={this.state.value} updateValue={this.updateValue}/>
			</div>
		);
	}
});
 
var InputBox1 = React.createClass({
	update:function(event){
		var modifiedValue=event.target.value;
		this.props.updateValue(modifiedValue);
	},
	render:function(){
		return (<input type="text" ref="inputValue" value={this.props.value} onChange={this.update} />)
	}
});
 
ReactDOM.render(<DisplayContainer1 />,document.getElementById("container1"));

var EditEmployee = React.createClass({
	getInitialState: function() {
	    return (this.emp = {name:'',
	    age:'',
	    years:''
	    });
	},
	
	handleNameChange(event) {
	console.log(this.emp);
	this.emp.name = event.target.value;
	this.setState(this.emp = {name:event.target.value});
    console.log(this.props.employee);
    
  },
	
	render: function() {
	console.log(this.emp);
	console.log('render method');
	this.emp = {name: this.props.employee.name, age:this.props.employee.age, years:this.props.employee.years};
	return (
		<div className="container">
		<h3>Edit Employee {this.emp.name} details</h3>
		<form className="align-center">
			<div className="form-group">
			  <label className="col-md-4">Id</label>
			  <span>{this.props.employee.id} </span>
			</div>
			<div className="form-group">
			  <label className="col-md-4">Name</label>
			  <input type="text" className="form-control-md" placeholder="Name" value={this.emp.name} onChange={this.handleNameChange}/>
			</div>
			<div className="form-group">
			  <label className="col-md-4">Age</label>
			  <input type="text" className="form-control-md" placeholder="Age" value={this.emp.age}/>
			</div>
			<div className="form-group">
			  <label className="col-md-4">Years</label>
			  <input type="text" className="form-control-md" placeholder="Years" value={this.emp.years}/>
			</div>
			<input className="btn btn-Success btn-sm" type="submit"  value="Save" onClick={this.updateEmployee}/>
		</form>
		</div>
	);
  	}
});

var EditForm = React.createClass({
	render: function() {
		
	}
});

var Employee = React.createClass({
	getInitialState: function() {
	    return {display: true };
	},
	handleDelete() {
    var self = this;
	    $.ajax({
	      url: "/employees/delete/"+self.props.employee.id,
	      type: 'DELETE',
	      success: function(result) {
	        self.setState({display: false});
	      },
	      error: function(xhr, ajaxOptions, thrownError) {
	        toastr.error(xhr.responseJSON.message);
	      }
	    });
  	},
  	handleEdit() {
  	console.log(this.props.employee);
  		ReactDOM.render(<EditEmployee employee={this.props.employee}/>, document.getElementById('edit') );
  	},
	render: function() {
	if (this.state.display==false) return null;
    else return (
		<tr>
		<td>{this.props.employee.id}</td>
        <td>{this.props.employee.name}</td>
        <td>{this.props.employee.age}</td>
        <td>{this.props.employee.years}</td>
        <td><button className="btn btn-sm btn-primary btn-success" onClick={this.handleEdit}>Edit</button></td>
        <td><button className="btn btn-sm btn-primary btn-warning" onClick={this.handleDelete}>Delete</button></td>
      	</tr>
	);
  	}
	});
	
var EmployeeTable = React.createClass({
	render: function() {
	var rows= [];
	this.props.employees.forEach(function(employee) {
		rows.push(<Employee employee={employee} />);
	});
    return (
		<div className="container">
			<h2>Employee Details</h2>
  			<table className="table table-striped">
    		<thead>
      			<tr>
      			<th>Id</th>
        			<th>Name</th>
        			<th>Age</th>
        			<th>Years</th>
      			</tr>
    		</thead>
    		<tbody>{rows}</tbody>
  			</table>
		</div>
	);
  	}
	});

var App = React.createClass({
 
  loadEmployeesFromServer: function () {
    var self = this;
    $.ajax({
      url: "/resnamfir/",
      headers: { 'Access-Control-Allow-Origin': '*' },
      crossDomain: true,
    }).then(function (data) {
    	console.log('rest data');
    	console.log(data);
    	console.log('total employees');
    	console.log(data.totalEmployees);
    	console.log('employees');
    	console.log(data.employees);
      self.setState({employees: data.employees});
    });
  },
 
  getInitialState: function () {
    return {employees: []};
  },
 
  componentDidMount: function () {
    this.loadEmployeesFromServer();
  },
 
  render() {
    return ( <EmployeeTable employees={this.state.employees}/> );
  }
});

ReactDOM.render(<App />, document.getElementById('root') );