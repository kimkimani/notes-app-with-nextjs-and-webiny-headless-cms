async function fetchAPI(query, { variables } = {}, preview,read ) {
    const url = preview ? process.env.NEXT_PUBLIC_WEBINY_PREVIEW_API_URL : (
      read ? process.env.NEXT_PUBLIC_WEBINY_API_READ_URL : process.env.NEXT_PUBLIC_WEBINY_API_MANAGE_URL );
    console.log("variables",variables);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJraWQiOiJoZHE1U0h3SzlncUdPaWFPcEQrcjlVV00wclZwWHN0RnZnRGY4NURQSUMwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI2Y2E5MTIyNS03OGViLTQ1MGItOTg5MS1iMzkzZjIzMTY4OWYiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfTHhyZUNQTXVvIiwiY29nbml0bzp1c2VybmFtZSI6Imtlbm13YW5naTI1MEBnbWFpbC5jb20iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJrZW5td2FuZ2kyNTBAZ21haWwuY29tIiwiZ2l2ZW5fbmFtZSI6Iktlbm5lZHkiLCJvcmlnaW5fanRpIjoiNDNmNWRiZmQtNWYyNS00MzE3LWE4N2ItYWYwOGIyNzFjMmQ5IiwiYXVkIjoiNGZ0cTh2am8zdHBnbXFsZTQwNTVtOWNtMjciLCJldmVudF9pZCI6IjEzOTUyZDI2LWZiOGItNGZhOC1iN2IzLWI0NWFlNTgyYWJkMiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjU2MTg2NDkyLCJleHAiOjE2NTYyNDU3NDUsImlhdCI6MTY1NjI0MjE0NSwiZmFtaWx5X25hbWUiOiJNd2FuZ2kiLCJqdGkiOiI3MDg3MmE3Zi1lY2U1LTRkZGMtYjliMi0yMTJiNWE4MGNlNzYiLCJlbWFpbCI6Imtlbm13YW5naTI1MEBnbWFpbC5jb20ifQ.Li0D0juU433clXcx82BXVs5Ntz13FEkBiQzHMkjcyv-LftFgbQAbgr-0dRyG9YACPiJztIhYZ4BitFSw-oP1vuHQZa9xGDWLJenEW_Om-cvO0gQWRUOpwDuWwZh0DvWOLSXr1VTdJHvKEj3jp_b0q6u_BQ9hJms9RtCU7L8l_5eOoqc7fSKv_ZZoET-jqAkDaS16kCmmoLP67lhEehiB45fetY6az4wxJMDKobMGr_cGjPkD3opfZ2kOMf9Otj5mS6hZ9qLk39wkB8w7as-VJ9TA7mwJNC2zubgmzAcVaHjB0qEUs9H6b55Rblu2RBzvo4uoPebDxWgA10YOnpz8Mw`
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
  
    const json = await res.json()
    if (json.errors) {
      throw new Error('Failed to fetch API')
    }
  
    return json.data
}
  
  
export async function getAllNotesForHome(preview) {
    const data = await fetchAPI(
        `query Notes {
          listNotes {
            data {
              id
              title
              description
            }
          }
        }
      `,
      {},
      preview,
      true
    );
    return data.listNotes.data
}
 

export async function addNote(data,preview=false){
  const response = await fetchAPI(`
    mutation createNote($title:String!,$description:String!){
      createNotes(data:{title:$title,description:$description}){
        data {
          id
          title
          description
          createdOn
        }
      }
    }
  `,{
    variables:{
      'title':data.title,
      'description':data.description
    }
  },preview,false);
  return response.createNotes.data;
}

export async function publishNote(data,preview=false){
  const response = await fetchAPI(`
    mutation publishNote($id:ID!){
      publishNotes(revision:$id){
        data {
          id
          title
          description
        }
      }
    }
  `,{
    variables:{
      id:data.id
    }   
  },preview,false);
  return response.publishNotes.data;
}

export async function deleteNote(data,preview=false){
  const response = await fetchAPI(`
    mutation publishNote($id:ID!){
      deleteNotes(revision:$id){
        data
      }
    }
  `,{
    variables:{
      id:data.id
    }   
  },preview,false);
  return response.deleteNotes.data;
}