import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button/Button';
import Container from '@material-ui/core/Container';
import {Paper} from '@material-ui/core'
import {FormControl} from '@material-ui/core'
import {InputLabel} from '@material-ui/core'
import {MenuItem} from '@material-ui/core';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default class IssueAdd extends React.Component
{
    constructor()
    {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.effortChange = this.effortChange.bind(this);
        this.state = {effort: ''}
    }

    handleSubmit(e)
    {
        e.preventDefault();
        let form = document.forms.issueAdd;
        this.props.createIssue(
            {
                owner: form.owner.value,
                title: form.title.value,
                effort: this.state.effort,
                status: 'New',
                created: new Date(),
            });
        form.owner.value = '';
        form.title.value = '';
        this.setState({effort:''})
    }

    effortChange(event)
    {
        this.setState({effort: event.target.value})
    }

    render()
    {
        return(
            <Container component={Paper} style={{}}>
                <form name="issueAdd" onSubmit={this.handleSubmit} >
                    <TextField name='owner' label="Owner"/>
                    <TextField name="title" label="Title"/>
                    <FormControl style={{margin:'theme.spacing(1)'}}>
                        <InputLabel id='effortLabel'>Effort</InputLabel>
                        <Select name='effort' labelid='effortLabel' id='effort' style={{minWidth:'110px'}} value = {this.state.effort} onChange = {this.effortChange}>
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" style={{verticalAlign:'bottom'}} type='submit'>Add</Button>
                </form>
            </Container>
        );
    }
}