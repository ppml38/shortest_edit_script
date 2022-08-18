//import copy

class entry{
    constructor(edits, edit_script){
        this.edits=edits
        this.edit_script=edit_script
    }

    __repr__(){
        return "{edit_distance: %d, edit_script: %s}"%(str(this.edits), str(this.edit_script))
    }

    __str__(){
        return this.__repr__()
    }
}

class data{
    constructor(input_data){
        this.data_piece = input_data.split(" ");
        this.length = this.data_piece.length;
    }

    get(i){
        return this.data_piece[i]
    }
}

class edit_script{
    constructor(data_a, data_b){
        this.data_a=data_a
        this.data_b=data_b
        this.no_of_rows=data_b.length+1
        this.no_of_columns=data_a.length+1
        this.edit_script_matrix=[]
        for(let i=0;i<this.no_of_rows;i++){
            let temp=[];
            for(let j=0;j<this.no_of_columns;j++){
            temp.push(null);
        }
        this.edit_script_matrix.push(temp);
        }
        this.generate_edit_script()
    }

    __repr__(){
        return str(this.edit_script_matrix)
    }

    __str__(){
        return this.__repr__()
    }

    get_shortest_edit_script(){
        return this.edit_script_matrix[this.data_b.length][this.data_a.length].edit_script
    }
    min(l){
        let m=Number(l[0]);
        for(let i of l){
            if(Number(i)<m){
                m=Number(i);
            }
        }
        return m;
    }
    generate_edit_script(){
        for(let i=0;i<this.no_of_columns;i++){
            let e_script=[];
            for(const [n,w] of this.data_a.data_piece.slice(0,i).entries()){
                e_script.push(`<div class="ins">At position ${n} delete <div class="str">${w}</div></div>"`);
            }
            let e=new entry(i,e_script);
            this.edit_script_matrix[0][i]=e;
        }
        for(let j=0;j<this.no_of_rows;j++){
            let e_script=[]
            for(const [n,w] of this.data_b.data_piece.slice(0,j).entries()){
                e_script.push(`<div class="ins">At position ${n} insert <div class="str">${w}</div></div>`);
            }
            let e=new entry(j,e_script)
            this.edit_script_matrix[j][0]=e
        }
        for(let i=0;i<this.data_b.length;i++){
            for(let j=0;j<this.data_a.length;j++){
                let new_entry=null;
                if(this.data_a.get(j)==this.data_b.get(i))
                {
                    //new_entry=copy.deepcopy(this.edit_script_matrix[i][j])
                    new_entry=JSON.parse(JSON.stringify(this.edit_script_matrix[i][j]))
                    // No edit required
                }
                else
                {
                    let new_edits=this.min([this.edit_script_matrix[i][j+1].edits,this.edit_script_matrix[i+1][j].edits,this.edit_script_matrix[i][j].edits])+1
                    if(this.edit_script_matrix[i][j+1].edits == this.edit_script_matrix[i+1][j].edits)
                    {
                        new_entry=JSON.parse(JSON.stringify(this.edit_script_matrix[i][j]));
                        // Substitution
                        new_entry.edit_script.push(`<div class="ins">At position ${i} substitute <div class="str">${this.data_a.get(j)}</div> with <div class="str">${this.data_b.get(i)}</div></div>`);
                    }
                    else
                    {
                        if(this.edit_script_matrix[i][j+1].edits< this.edit_script_matrix[i+1][j].edits)
                        {
                            new_entry=JSON.parse(JSON.stringify(this.edit_script_matrix[i][j+1]));
                            // Addition
                            new_entry.edit_script.push(`<div class="ins">At position ${i} add <div class="str">${this.data_b.get(i)}</div></div>`);
                        }
                        else
                        {
                            new_entry=JSON.parse(JSON.stringify(this.edit_script_matrix[i+1][j]));
                            // Deletion
                            new_entry.edit_script.push(`<div class="ins">At position ${j} delete <div class="str">${this.data_a.get(j)}</div></div>`);
                        }
                    }
                    new_entry.edits=Number(new_edits);
                }
                this.edit_script_matrix[i+1][j+1]=new_entry;
            }
            }
        }
            }
        

function test_edit_script(input_a, input_b)
{
    return new edit_script(new data(input_a),new data(input_b)).get_shortest_edit_script();
}
function clear_script(){
    document.getElementById('script').innerHTML='';
}
demo_box_visible=false;
function toggle_demo(){
    if(demo_box_visible){
        document.getElementById('menu_box').style.display='inline-block';
    document.getElementById('demo_box').style.display='none';
    document.getElementById('back').style.display='none';
    demo_box_visible=false;
    }
    else{
    document.getElementById('menu_box').style.display='none';
    document.getElementById('demo_box').style.display='inline-block';
    document.getElementById('back').style.display='inline-block';
    demo_box_visible=true;
}
}
function hide_script()
{
    clear_script();
    document.getElementById('edit_script').style.display='none';

}
function handleClick(){
    clear_script();
    document.getElementById('edit_script').style.display='block';
for(t of test_edit_script(document.getElementById('source').value,document.getElementById('destination').value)){
document.getElementById('script').innerHTML+=t;
}
}
