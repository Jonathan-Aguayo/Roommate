import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button/Button';
import Container from '@material-ui/core/Container';

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
    }

    handleSubmit(e)
    {
        e.preventDefault();
        var form = document.forms.issueAdd;
        this.props.createIssue(
            {
                owner: form.owner.value,
                title: form.title.value,
                status: 'New',
                created: new Date(),
            });
        form.owner.value = '';
        form.title.value = '';
    }
    render()
    {
        return(
            <Container style={{textAlign:'center'}}>
            <form name="issueAdd" onSubmit={this.handleSubmit} >
                <TextField name='owner' label="Owner"/>
                <TextField name="title" label="Title"/>
                <Button variant="contained" style={{padding:'4px'}} type='submit'>Add</Button>
            </form>
            </Container>
        );
    }
}