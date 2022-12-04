import fs from 'fs'
import path from 'path'
import category from '../models/categories'
import mongoose from 'mongoose'
import domain from '../models/domains';


const url = 'mongodb://127.0.0.1:27017/ens';
const initDB = async () => {
    await mongoose.connect(url)
    console.log("✅ Connected to db")
}

const createCollections = async () => {
    await initDB()
    const categoryData = fs.readFileSync(path.resolve("src/constants/categories.json"), {
        encoding: 'utf-8'
    })
    const categoryDataObj = JSON.parse(categoryData).map((cat: any) => {
        const { csv, ...rest } = cat
        return { rest, csv }
    })
    await category.deleteMany({})
    await domain.deleteMany({})

    await category.create(categoryDataObj.map((cat: any) => cat.rest))

    categoryDataObj.forEach(async (cat: any, idx: number) => {
        console.log("=====idx====", idx, cat.rest.name)
        try {
            if (cat.csv.length > 0) {
                console.log("=====going in=====")
                const catDomains = fs.readFileSync(path.resolve(`src/constants/collections/${cat.csv[0]}`), {
                    encoding: 'utf-8'
                })
                const catDomainArr = catDomains?.split("\n").filter(d => d?.split(",").length === 2).map(d => {
                    const dArr = d.split(",")
                    console.log("====DArr=====", dArr)
                    return {
                        name: dArr[0],
                        token: dArr[1],
                        category: cat.rest.name,
                        slug: cat.rest.slug
                    }
                }).filter(d => !!d.name && !!d.token && !!d.category)
                console.log('=====catDomainArr===', catDomainArr.length)
                await domain.insertMany(catDomainArr)
                console.log("====coming here====")
            } else {
                console.log("====coming err====")
            }
        } catch (err) {
            console.log(err, cat,)
        }
    })
    console.log("✅ Done")
    return
}

createCollections()