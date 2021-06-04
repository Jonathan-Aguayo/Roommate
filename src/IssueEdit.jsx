import React from 'react';
import Button from '@material-ui/core/Button/Button';
import Container from '@material-ui/core/Container';
import Select from '@material-ui/core/Select';
import {Typography} from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl';
import {MenuItem} from '@material-ui/core';
import {InputLabel} from '@material-ui/core';
import 'whatwg-fetch';
import _ from 'lodash'
import {Paper} from '@material-ui/core'


export default class IssueEdit extends React.Component 
{ 
    constructor(props)
    {
        super(props);

        this.state = 
        {
            issue:
            {
                _id:'',
                title:'',
                status:'',
                owner:'',
                effort:'',
                completionDate: null,
                created:''
            },
            urlId: this.props.match.params.id
        };p
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.loadData = this.loadData.bind(this);
        this.displayData = {};
    }

    onChange(event)
    {
        const issue = Object.assign({}, this.state.issue);
        issue[event.target.name] = event.target.value;
        this.setState({issue});
    }

    componentDidUpdate(prevProps) 
    {
        if (this.props.match.params.id !== prevProps.match.params.id)
        {
            this.loadData();
        }
    }

    componentDidMount()
    {
        this.loadData();
    }

    loadData()
    {
        fetch(`/api/v1/issues/${this.props.match.params.id}`)
        .then(response =>
            {
                if(response.ok)
                {
                    
                    response.json().then(issue1 =>
                        {
                            issue1.record.created = new Date(issue1.record.created).toDateString();
                            issue1.record.completionDate = issue1.record.completionDate != null ? new Date(issue1.record.completionDate).toDateString() : '';
                            issue1.record.effort = issue1.record.effort != null ? issue1.record.effort.toString() : '';
                            this.displayData = _.cloneDeep(issue1.record)
                            this.setState( {issue:issue1.record} );
                        })
                }
                else
                {
                    response.json().then(error => {alert(`Failed to fetch issue: ${error.message}`)});
                }
            })
        .catch(error => 
            {
                alert(`Error in fetching data from server: ${error.message}`)
            });
    }

    handleSubmit(e)
    {
        e.preventDefault();
        const issue = this.state.issue;
        if(issue.status === 'Closed')
        {
            issue.completionDate = new Date();
        }
        else
        {
            delete issue.completionDate;
        }
        if(issue.completionDate == null)
        {
            delete issue.completionDate;
        }
        console.log(issue)
        fetch(`/api/v1/issues/${this.props.match.params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issue),
        }).then(response =>
            {
                if( response.ok)
                {
                    response.json().then(updatedIssue => 
                        {
                            updatedIssue.created = new Date(updatedIssue.created).toDateString();
                            if(updatedIssue.completionDate) {updatedIssue.completionDate = new Date(updatedIssue.completionDate).toDateString();}
                            this.displayData = _.cloneDeep(updatedIssue);
                            this.setState({issue:updatedIssue});
                            console.log('Success');
                        });
                }
                else
                {
                    response.json().then(error =>
                        {
                            console.log(error);
                            alert(`Error: ${error.message}`)
                        });
                };
            })
            .catch( err =>
                {
                    alert(`Error in sending data to server ${err.message}`)
                });
    }

    render() 
    {
        return (
            <Container component = {Paper} style={{textAlign:'center',}}>
                <form name="issueEdit" onSubmit={this.handleSubmit} >
                    <Typography> ID: {this.displayData._id} </Typography>
                    <Typography> Title: {this.displayData.title} </Typography>
                    <Typography> Status: {this.displayData.status} </Typography>
                    <Typography> Effort: {this.displayData.effort} </Typography>
                    <Typography> Created: {this.displayData.created} </Typography>
                    <Typography> Completed: {this.displayData.completionDate} </Typography>
                    <Typography> Owner: {this.displayData.owner} </Typography>
     
                    <FormControl>
                        <InputLabel id='statusLabel'>Status</InputLabel>
                        <Select name='status' labelid='statusLabel' id='status' style={{minWidth:'110px'}} value = {this.state.issue.status} onChange = {this.onChange}>
                            <MenuItem value={'New'}>New</MenuItem>
                            <MenuItem value={'Open'}>Open</MenuItem>
                            <MenuItem value={'Fixed'}>Fixed</MenuItem>
                            <MenuItem value={'Verified'}>Verified</MenuItem>
                            <MenuItem value={'Closed'}>Closed</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl style={{margin:'theme.spacing(1)'}}>
                        <InputLabel id='effortLabel'>Effort</InputLabel>
                        <Select name='effort' labelid='effortLabel' id='effort' style={{minWidth:'110px'}} value = {this.state.issue.effort} onChange = {this.onChange}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" style={{marginLeft:'3%',padding:'3px', verticalAlign:'bottom'}} type='submit'>Submit</Button>
                </form>
            </Container>
        );
    }
}