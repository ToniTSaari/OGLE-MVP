import React from 'react'
import requestService from '../services/requestService'

class DeleteForm extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {value:''}

        this.submit = this.submit.bind(this)
    }
    submit = async (event) =>
    {
        event.preventDefault()
        try
        {
            const content = {email:window.localStorage.getItem('email')}
            await requestService.poster({url:"/findAcc", content:content}).then((res)=>
            {
                requestService.poster({url:"/delAcc", content:{email:res.email}})
                requestService.poster({url:"/delChar", content:{email:res.email}})
                window.localStorage.clear('*')
                window.location.href = '/'
            })
        }
        catch
        {
            alert('HTTP error!')
        }
    }
    render()
    {
        return(
            <div>
                Account: {window.localStorage.getItem('email')}<br/>
                <form onSubmit={this.submit}>
                    Confirm deletion;<br/>
                    <input id="delButton" type="submit" value="Delete"/>
                </form>
            </div>
        )
    }
}

export default DeleteForm