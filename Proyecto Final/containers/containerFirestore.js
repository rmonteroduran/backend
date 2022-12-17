import { firestoreDatabase } from './firestoreClient.js';

async function read(name) {
    try {
        const querySnapshot = await firestoreDatabase.collection(name).get()
        const result = []
        querySnapshot.forEach(doc => {
            result.push(doc.data())
        })
        return result
    } catch (err) {
        return(err)
    }
}

async function add(name, data) {
    try {
        const ref = await firestoreDatabase.collection(name).add(data)
        return { ...data, id: ref.id }
    } catch (err) {
        return(err)
    }
}

async function update(name, data, id) {
    try {
        let item = await firestoreDatabase.collection(name).doc(`${id}`).update({data})
        return { item }
    } catch (err) {
        return(err)
    }
}

async function del(name, id) {
    try {
        const item = await firestoreDatabase.collection(name).doc(`${id}`).delete()
        return { item }
    } catch (err) {
        return(err)
    }
}

export { read, add, update, del }