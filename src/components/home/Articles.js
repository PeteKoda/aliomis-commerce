import Image from 'next/image'

import axios from "axios";
import react, { useEffect } from "react"
import { useState } from 'react';
import htmlDecode from "html-entities-decoder"



const Articles = ({ }) => {

    // if (isEmpty(clients)) {
    //     return null;
    // }
    const [posts, setPosts] = useState([])

    useEffect(() => {
        axios({
            url: 'https://admin.blog.aliomis.com/graphql',
            method: 'post',
            data: {
                query: `
                query Posts {
                    posts(first:3){
                        edges{
                          node{
                            title
                            excerpt
                            featuredImage{
                              altText
                              sourceUrl
                            }
                            date
                            slug
                            categories{
                                edges{
                                    node{
                                        slug
                                    }
                                }
                            }
                          }
                        }
                      }
                  }
                `
            }
        }).then((result) => {
            console.log(result.data.data)
            setPosts(result.data.data.posts)
        });
    }, [])

    return (
        <div className="mt-20 mb-32">
            <div>
                <div className="text-center">
                    <span className="featured-s-p">Daily Dose of Tips</span>
                    <h2 className="featured-s-h2">READ OUR BLOG</h2>
                </div>
                <div className="flex flex-wrap container m-auto pt-8">
                    {(posts && posts.edges && posts.edges.length > 0) && posts.edges.map((post, i) => (
                        <div className={`relative w-full md:w-1/3 px-4 md:pt-0 ${i !== 0 && ("pt-8")}`} data-sal="slide-up" data-sal-delay={`"${(i+1) * 300}"`} data-sal-duration="500" data-sal-easing="ease-out-sine">
                            <a href={`https://blog.aliomis.com/${post.node.categories.edges[0].node.slug}/${post.node.slug}`}>
                                <Image
                                    alt={post.node.featuredImage.altText}
                                    src={post.node.featuredImage.sourceUrl}
                                    layout="responsive"
                                    quality={100}
                                    width={210}
                                    height={200}
                                    className="rounded"
                                />
                                <h3 className="featured-s-h3 mt-4">{htmlDecode(post.node.title)}</h3>
                                <div className="article-excerpt" dangerouslySetInnerHTML={{ __html: post.node.excerpt }} />
                                <div>
                                    <a className="text-black mt-4 relative" style={{top:"10px"}}>
                                        Read More
                                    </a>    
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Articles
