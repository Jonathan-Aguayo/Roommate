import React from 'react';
import 'whatwg-fetch';
import {TextField} from '@material-ui/core';
import {Button} from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';

export class AddMessage extends React.Component
{
    /*
        Algo where put all household members in an array and use modulo to select different members from the array so that chores get assigned randomly and will hopefully not put too many chores on any two people
    */
   //State
    constructor(props)
    {
        super(props);
        this.state = {
            title: '',
            body: '',
            open: false,
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleSubmit(e)
    {
        e.preventDefault();
        const form = document.forms.addMessage;
        const messageBody = 
        {
            title: form.title.value,
            body: form.body.value,
            postedOn: new Date(),
            completed: false,
        }
        this.props.createMessage(messageBody);
        this.setState({
            title: '',
            body: '',
        })
    }

    handleClose()
    {
        this.setState({open: !this.state.open});
    }

    handleOpen()
    {
        this.setState({open: true})
    }

    render()
    {
        return(
        <div>
            <Button variant = 'outlined' onClick={this.handleOpen}>
                Add Message
            </Button>
            <Dialog onClose = {this.handleClose} open={this.state.open} style={{maxWidth: 'false'}}>
                <DialogTitle id="simple-dialog-title">Add Message</DialogTitle>
                <form noValidate autoComplete='off' name='addMessage' style={{ padding: '25px', maxWidth: 'false'}}>
                    <TextField
                    id="title"
                    label="Message Title"
                    fullWidth
                    multiline
                    name='title'
                    rowsMax={2}
                    value={this.state.title}
                    onChange={ (event) => {this.setState({title: event.target.value})} } 
                    style={{ paddingTop: '10px' }}/>
                    <TextField
                    id="body"
                    label="Message body"
                    multiline
                    fullWidth
                    name='body'
                    rowsMax={6}
                    value={this.state.body}
                    onChange={ (event) => {this.setState({body: event.target.value})} } 
                    style={{ paddingTop: '10px' }}/>
                    <DialogActions style={{  }}>
                        <Button value='submit' type='submit' onClick={this.handleSubmit} style={{verticalAlign:'bottom', }}>Submit</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </div>)
    }
}