import copy

class entry:
    def __init__(self, edits, edit_script):
        self.edits=edits
        self.edit_script=edit_script

    def __repr__(self):
        return "{edit_distance: %d, edit_script: %s}"%(str(self.edits), str(self.edit_script))

    def __str__(self):
        return self.__repr__()

class data:
    def __init__(self, input_data):
        self.data_piece = input_data.split(" ")
        self.length = len(self.data_piece)

    def get(self, i):
        return self.data_piece[i]

class edit_script:
    def __init__(self, data_a, data_b):
        self.data_a=data_a
        self.data_b=data_b
        self.no_of_rows=data_b.length+1
        self.no_of_columns=data_a.length+1
        self.edit_script_matrix=[]
        for _ in range(self.no_of_rows):
            self.edit_script_matrix.append([None]*(self.no_of_columns))
        self.generate_edit_script()

    def __repr__(self):
        return str(self.edit_script_matrix)

    def __str__(self):
        return self.__repr__()

    def get_shortest_edit_script(self):
        return self.edit_script_matrix[self.data_b.length][self.data_a.length].edit_script

    def generate_edit_script(self):
        for i in range(self.no_of_columns):
            e_script=[]
            for n,w in enumerate(self.data_a.data_piece[:i]):
                e_script.append("At position %d delete %s"%(n,w))
            e=entry(i,e_script)
            self.edit_script_matrix[0][i]=e
        for j in range(self.no_of_rows):
            e_script=[]
            for n,w in enumerate(self.data_b.data_piece[:j]):
                e_script.append("At position %d insert %s"%(n,w))
            e=entry(j,e_script)
            self.edit_script_matrix[j][0]=e
        for i in range(0,self.data_b.length):
            for j in range(0,self.data_a.length):
                new_entry=None
                if self.data_a.get(j)==self.data_b.get(i):
                    new_entry=copy.deepcopy(self.edit_script_matrix[i][j])
                    # No edit required
                else:
                    new_edits=min(self.edit_script_matrix[i][j+1].edits,self.edit_script_matrix[i+1][j].edits,self.edit_script_matrix[i][j].edits)+1
                    if self.edit_script_matrix[i][j+1].edits == self.edit_script_matrix[i+1][j].edits:
                        new_entry=copy.deepcopy(self.edit_script_matrix[i][j])
                        # Substitution
                        new_entry.edit_script.append("At position %d substitute %s with %s"%(i,self.data_a.get(j),self.data_b.get(i)))
                    else:
                        if self.edit_script_matrix[i][j+1].edits< self.edit_script_matrix[i+1][j].edits:
                            new_entry=copy.deepcopy(self.edit_script_matrix[i][j+1])
                            # Addition
                            new_entry.edit_script.append("At position %d add %s"%(i,self.data_b.get(i)))
                        else:
                            new_entry=copy.deepcopy(self.edit_script_matrix[i+1][j])
                            # Deletion
                            new_entry.edit_script.append("At position %d delete %s"%(j,self.data_a.get(j)))
                    new_entry.edits=new_edits
                self.edit_script_matrix[i+1][j+1]=new_entry

def test_edit_script(input_a, input_b):
    return edit_script(data(input_a),data(input_b)).get_shortest_edit_script()


print(test_edit_script("I am very happy","I am so much happy"))
