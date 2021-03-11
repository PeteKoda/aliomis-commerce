import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";
import SectionTitle from "@components/section-title";
import { PostGrid } from "@components/post";
import axios from "axios";
import react, { useEffect } from "react"
import { useState } from 'react';
import htmlDecode from "html-entities-decoder"

import sal from 'sal.js'



const LatestBlog = ({ blogs }) => {

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

            sal()
        });
    }, [])

    return (
        <div className="container-indent">
            <Container>
                <SectionTitle
                    title="Les dernières infos du blog"
                    content="THE FRESHEST AND MOST EXCITING NEWS"
                />

                <div className="tt-blog-thumb-list">
                    <Row>
                        {(posts && posts.edges && posts.edges.length > 0) && posts.edges.map((blog, i) => (
                            <Col md={6} lg={4} key={blog.title}>
                                <div data-sal="slide-up" data-sal-delay={`${(i+1)*200 }`} data-sal-duration="500" data-sal-easing="ease-out-sine">
                                    <PostGrid
                                        slug={`https://blog.aliomis.com/${blog.node.categories.edges[0].node.slug}/${blog.node.slug}`}
                                        title={htmlDecode(blog.node.title)}
                                        thumb={blog.node.featuredImage.sourceUrl}
                                        altText={blog.node.featuredImage.altText}
                                        excerpt={blog.node.excerpt}
                                        date={blog.node.date}
                                        categories={blog.node.categories.edges}
                                    />
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>
        </div>
    );
};

LatestBlog.prototype = {
    blogs: PropTypes.array.isRequired
}

export default LatestBlog;