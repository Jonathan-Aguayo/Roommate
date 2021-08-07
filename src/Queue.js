class Queue
{
    constructor(startingArray)
    {
        this.items = startingArray;
    }

    enqueue(element)
    {
        this.items.push(element);
    }

    dequeue()
    {
        return this.items.shift()
    }

    front()
    {
        if (this.isEmpty())
        {
            return 'No elements';
        }
        return this.items[0];
    }

    isEmpty()
    {
        return this.items.length == 0;
    }

    printAll()
    {
        let str = '';
        for( let i = 0; i < this.items.length; i++ )
        {
            str += this.items[i] + ' ';
        }
        return str;
    }
}

module.exports = Queue;