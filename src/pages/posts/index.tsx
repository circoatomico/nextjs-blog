
import Head from 'next/head';

import styles from './styles.module.scss';
import Link from 'next/link';

import Image from 'next/image';
import thumbImg from '../../../public/images/thumb.png';

import { getPrismicClient } from '../../services/prismic'
import Prismic from '@prismicio/client'
import {RichText} from 'prismic-dom'

import {FiChevronLeft, FiChevronsLeft, FiChevronRight, FiChevronsRight} from 'react-icons/fi'
import { GetStaticProps } from 'next';
import { useState } from 'react';

type Post = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  updatedAt: string;
}

interface PostsProps{
  posts: Post[],
  page: string;
  totalPage: string;
}

export default function Posts({posts: PostsBlog, page, totalPage}: PostsProps){

  const [ posts, setPosts] = useState(PostsBlog || []);
  const [currentPage, setCurrentPage] = useState(Number(page))

  // Buscar novos posts
  async function reqPost(pageNumber: number) {
    const prismic = getPrismicClient();
    const response = await prismic.getByType('post', {pageSize: 1, page: pageNumber})

    return response;

  }

  async function navegatePage (pageNumber: number) {
    const response = await reqPost(pageNumber)
    if (response.results.length === 0) {
      return ;
    } else {
      const getPosts = response.results.map( post => {
        return {
          slug: post.uid,
          title: RichText.asText(post.data.title),
          description: post.data.description.find(content => content.type === 'paragraph')?.text ?? '',
          cover: post.data.cover.url,
          updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }),
        }
      })

      setCurrentPage(pageNumber)
      setPosts( getPosts )

    }
    console.log(response)
  }

  return(
    <>
     <Head>
       <title>Blog | Sujeito Programador</title>
     </Head>
     <main className={styles.container}>
       <div className={styles.posts}>

        {posts.map(post => (
          <Link key={post.slug} href={`/posts/${post.slug}`}>
            <a key={post.slug}>
              <Image
                src={post.cover}
                alt={post.title}
                width={720}
                height={410}
                quality={100}
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
                placeholder="blur"
              />
              <strong>{post.title}</strong>
              <time>{post.updatedAt}</time>
              <p>Hoje vamos criar o controle de mostrar a senha no input, uma opção para os nossos formulários de cadastro e login. Mas chega de conversa e bora pro código junto comigo que o vídeo está show de bola!</p>
            </a>
          </Link>
        ))}


         <div className={styles.buttonNavigate}>

           {Number(currentPage) >= 2 &&(
             <div>
              <button onClick={ () => navegatePage(1) }>
                <FiChevronsLeft size={25} color="#FFF" />
              </button>

              <button onClick={ () => navegatePage(Number( currentPage - 1 )) }>
                <FiChevronLeft size={25} color="#FFF" />
              </button>
            </div>
           )}

           {Number(currentPage) < Number(totalPage) && (
             <div>
              <button onClick={ () => navegatePage(Number(currentPage + 1)) }>
                <FiChevronRight size={25} color="#FFF" />
              </button>

              <button onClick={ () => navegatePage(Number(totalPage)) }>
                <FiChevronsRight size={25} color="#FFF" />
              </button>
            </div>
           )}

         </div>
       </div>
     </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const prismic = getPrismicClient();
  const response = await prismic.getByType('post', {pageSize: 1})

  const posts = response.results.map( post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      description: post.data.description.find(content => content.type === 'paragraph')?.text ?? '',
      cover: post.data.cover.url,
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
    }
  })


  return{
    props: {
      posts,
      page: response.page,
      totalPage: response.total_pages
    },
    revalidate: 60 * 30 // Atualiza a cada 30 minutos
  }
}