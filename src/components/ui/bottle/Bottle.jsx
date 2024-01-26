'use client'

import { useState } from 'react';
import { ReactSortable } from 'react-sortablejs';

export const Bottle = ({ variant }) => {
  let mainFill, secondaryFill;
  
  switch (variant) {
    case 'red':
      mainFill = '#ff002b';
      secondaryFill = '#c00021';
      break;
    case 'white':
      mainFill = '#cccccc';
      secondaryFill = '#999999';
      break;
    case 'rose':
      mainFill = '#FFC0CB';
      secondaryFill = '#ef798a';
      break;
    case 'green':
      mainFill = '#00FF00';
      secondaryFill = '#00CC00';
      break;
    case 'yellow':
      mainFill = '#FFFF00';
      secondaryFill = '#FFD700';
      break;
    case 'orange':
      mainFill = '#FFA500';
      secondaryFill = '#FF8C00';
      break;
    case 'purple':
      mainFill = '#800080';
      secondaryFill = '#6A0DAD';
      break;
    case 'magenta':
      mainFill = '#FF00FF';
      secondaryFill = '#DA70D6';
      break;
    case 'lavender':
      mainFill = '#E6E6FA';
      secondaryFill = '#CCCCFF';
      break;
    default:
      mainFill = '#63D3FD';
      secondaryFill = '#3DB9F9';
      break;
  }
  
    
  return (
    <svg height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve">
      <g transform="translate(1 1)">
        <path style={{fill: mainFill}} d="M357.922,246.467c0-13.653-11.947-25.6-25.6-25.6c13.653,0,25.6-11.947,25.6-25.6
          s-11.947-25.6-25.6-25.6h17.067c5.12,0,8.533-4.267,7.68-9.387c-4.267-42.667-40.107-75.947-84.48-75.947
          c30.72,0,56.32,33.28,59.733,75.947c0,5.12-2.56,9.387-5.973,9.387h-11.947c10.24,0,17.92,11.947,17.92,25.6s-7.68,25.6-17.92,25.6
          c10.24,0,17.92,11.947,17.92,25.6c0,13.653-7.68,25.6-17.92,25.6c12.8,0,22.187,18.773,16.213,37.547
          c-2.56,8.533-9.387,13.653-16.213,13.653l0,0c6.827,0,11.947,7.68,11.947,17.067v113.493c0,26.453-15.36,48.64-34.133,48.64h8.533
          c26.453,0,48.64-21.333,48.64-48.64V340.333c0-9.387-7.68-17.067-17.067-17.067l0,0c9.387,0,18.773-5.12,23.04-13.653
          c8.533-18.773-5.12-37.547-23.04-37.547C345.975,272.067,357.922,260.973,357.922,246.467"/>
        <path style={{fill: "white"}} d="M221.388,41.667V24.6c0-9.387,7.68-17.067,17.067-17.067h-25.6c-9.387,0-17.067,7.68-17.067,17.067
          v17.067c0,5.12,3.413,8.533,7.68,8.533h25.6C224.801,50.2,221.388,46.787,221.388,41.667"/>
        <path style={{fill: secondaryFill}} d="M281.121,7.533h-25.6c9.387,0,17.067,7.68,17.067,17.067v17.92c0,4.267-3.413,7.68-8.533,7.68h25.6
          c5.12,0,8.533-3.413,8.533-7.68V24.6C298.188,15.213,290.508,7.533,281.121,7.533"/>
        <g>
          <path style={{fill: mainFill}} d="M272.588,50.2h-51.2c-5.12,0-8.533-3.413-8.533-7.68V24.6c0-9.387,7.68-17.067,17.067-17.067
            h34.133c9.387,0,17.067,7.68,17.067,17.067v17.92C281.121,46.787,277.708,50.2,272.588,50.2"/>
          <path style={{fill: mainFill}} d="M246.988,84.333c8.533,0,17.067,1.707,25.6,3.413V50.2h-51.2v37.547
            C229.921,86.04,238.455,84.333,246.988,84.333"/>
          <path style={{fill: mainFill}} d="M306.721,246.467c0-13.653-7.68-25.6-17.92-25.6c10.24,0,17.92-11.947,17.92-25.6
            s-7.68-25.6-17.92-25.6h11.947c3.413,0,5.973-4.267,5.973-9.387c-3.413-42.667-28.16-75.947-59.733-75.947
            s-56.32,33.28-59.733,75.947c0,5.12,2.56,9.387,5.973,9.387h11.947c-10.24,0-17.92,11.947-17.92,25.6s7.68,25.6,17.92,25.6
            c-10.24,0-17.92,11.947-17.92,25.6c0,13.653,7.68,25.6,17.92,25.6c-12.8,0-22.187,18.773-16.213,37.547
            c2.56,8.533,9.387,13.653,16.213,13.653l0,0c-6.827,0-11.947,7.68-11.947,17.067v113.493c0,26.453,15.36,48.64,34.133,48.64
            h39.253c18.773,0,34.133-21.333,34.133-48.64V340.333c0-9.387-5.12-17.067-11.947-17.067l0,0c6.827,0,12.8-5.12,16.213-13.653
            c5.973-18.773-3.413-37.547-16.213-37.547C299.042,272.067,306.721,260.973,306.721,246.467"/>
        </g>
        <path style={{fill: "white"}} d="M162.508,160.28c-0.853,5.12,2.56,9.387,7.68,9.387h17.067c-13.653,0-25.6,11.947-25.6,25.6
          s11.947,25.6,25.6,25.6c-13.653,0-25.6,11.947-25.6,25.6c0,13.653,11.947,25.6,25.6,25.6c-17.92,0-31.573,18.773-23.04,37.547
          c4.267,8.533,13.653,13.653,23.04,13.653l0,0c-9.387,0-17.067,7.68-17.067,17.067v113.493c0,27.307,21.333,48.64,48.64,48.64h8.533
          c-18.773,0-34.133-21.333-34.133-48.64V340.333c0-9.387,5.12-17.067,11.947-17.067l0,0c-6.827,0-12.8-5.12-16.213-13.653
          c-5.973-18.773,3.413-37.547,16.213-37.547c-10.24,0-17.92-11.093-17.92-25.6c0-14.507,7.68-25.6,17.92-25.6
          c-10.24,0-17.92-11.093-17.92-25.6s7.68-25.6,17.92-25.6h-11.947c-3.413,0-5.973-4.267-5.973-9.387
          c3.413-42.667,28.16-75.947,59.733-75.947C202.615,84.333,166.775,117.613,162.508,160.28"/>
        <path style={{fill: secondaryFill}} d="M332.322,246.467c0-13.653-11.947-25.6-25.6-25.6c13.653,0,25.6-11.947,25.6-25.6
          s-11.947-25.6-25.6-25.6h17.067c5.12,0,8.533-4.267,7.68-9.387c-4.267-42.667-40.107-75.947-84.48-75.947
          c30.72,0,56.32,33.28,59.733,75.947c0,5.12-2.56,9.387-5.973,9.387h-11.947c10.24,0,17.92,11.947,17.92,25.6s-7.68,25.6-17.92,25.6
          c10.24,0,17.92,11.947,17.92,25.6c0,13.653-7.68,25.6-17.92,25.6c12.8,0,22.187,18.773,16.213,37.547
          c-2.56,8.533-9.387,13.653-16.213,13.653l0,0c6.827,0,11.947,7.68,11.947,17.067v113.493c0,26.453-15.36,48.64-34.133,48.64h8.533
          c26.453,0,48.64-21.333,48.64-48.64V340.333c0-9.387-7.68-17.067-17.067-17.067l0,0c9.387,0,18.773-5.12,23.04-13.653
          c8.533-18.773-5.12-37.547-23.04-37.547C320.375,272.067,332.322,260.973,332.322,246.467"/>
        <path d="M289.655,58.733h-85.333c-9.387,0-17.067-7.68-17.067-17.067V24.6c0-14.507,11.093-25.6,25.6-25.6h68.267
          c14.507,0,25.6,11.093,25.6,25.6v17.92C306.721,51.053,299.042,58.733,289.655,58.733z M212.855,16.067
          c-5.12,0-8.533,3.413-8.533,8.533v17.92h85.333V24.6c0-4.267-3.413-8.533-8.533-8.533H212.855z"/>
        <path d="M272.588,96.28c-0.853,0-1.707,0-2.56,0c-15.36-4.267-30.72-4.267-46.933,0c-2.56,0.853-5.12,0-7.68-1.707
          c-1.707-1.707-2.56-4.267-2.56-6.827V50.2c0-5.12,3.413-8.533,8.533-8.533h51.2c5.12,0,8.533,3.413,8.533,8.533v37.547
          c0,2.56-0.853,5.12-3.413,6.827C276.001,96.28,274.295,96.28,272.588,96.28z M246.988,75.8c5.973,0,11.093,0.853,17.067,1.707
          V58.733h-34.133v18.773C235.895,76.653,241.015,75.8,246.988,75.8z"/>
        <path d="M275.148,511h-56.32c-31.573,0-57.173-25.6-57.173-57.173v-28.16c0-5.12,3.413-8.533,8.533-8.533
          c5.12,0,8.533,3.413,8.533,8.533v28.16c0,22.187,17.92,40.107,40.107,40.107h56.32c22.187,0,40.107-17.92,40.107-40.107V340.333
          c0-5.12-3.413-8.533-8.533-8.533s-8.533-3.413-8.533-8.533c0-5.12,3.413-8.533,8.533-8.533c6.827,0,12.8-3.413,15.36-8.533
          c4.267-8.533,0.853-14.507-0.853-17.067c-3.413-5.12-8.533-7.68-14.507-7.68c-5.12,0-8.533-3.413-8.533-8.533
          c0-5.12,3.413-8.533,8.533-8.533c9.387,0,17.067-7.68,17.067-17.067c0-9.387-7.68-17.067-17.067-17.067
          c-5.12,0-8.533-3.413-8.533-8.533c0-5.12,3.413-8.533,8.533-8.533c9.387,0,17.067-7.68,17.067-17.067s-7.68-17.067-17.067-17.067
          c-5.12,0-8.533-3.413-8.533-8.533c0-5.12,3.413-8.533,8.533-8.533h17.067c-4.267-38.4-37.547-68.267-76.8-68.267
          s-72.533,29.867-76.8,68.267h14.507c0.853,0,0.853,0,1.707,0c5.12,0,8.533,3.413,8.533,8.533c0,5.12-3.413,8.533-8.533,8.533
          c-9.387,0-17.067,7.68-17.067,17.067s7.68,17.067,17.067,17.067c5.12,0,8.533,3.413,8.533,8.533c0,5.12-3.413,8.533-8.533,8.533
          c-9.387,0-17.067,7.68-17.067,17.067c0,9.387,7.68,17.067,17.067,17.067c5.12,0,8.533,3.413,8.533,8.533
          c0,5.12-3.413,8.533-8.533,8.533c-5.973,0-11.093,3.413-14.507,7.68c-1.707,3.413-4.267,9.387-0.853,17.067
          c2.56,5.12,8.533,8.533,15.36,8.533c5.12,0,8.533,3.413,8.533,8.533c0,5.12-3.413,8.533-8.533,8.533
          c-5.12,0-8.533,3.413-8.533,8.533V357.4c0,5.12-3.413,8.533-8.533,8.533c-5.12,0-8.533-3.413-8.533-8.533v-17.067
          c0-5.973,1.707-11.093,5.12-15.36c-4.267-3.413-7.68-6.827-10.24-11.947c-5.12-11.093-5.12-23.893,1.707-34.133
          c1.707-2.56,4.267-5.12,5.973-7.68c-5.973-5.12-10.24-14.507-10.24-24.747c0-10.24,4.267-19.627,11.947-25.6
          c-7.68-5.973-11.947-15.36-11.947-25.6c0-7.68,2.56-14.507,6.827-20.48c-0.853-0.853-1.707-0.853-2.56-1.707
          c-3.413-3.413-5.12-8.533-4.267-12.8c5.12-48.64,46.08-84.48,93.867-84.48s88.747,35.84,93.013,83.627
          c0.853,5.12-0.853,9.387-4.267,12.8c-0.853,0.853-1.707,1.707-2.56,1.707c4.267,5.973,6.827,12.8,6.827,20.48
          c0,10.24-4.267,19.627-11.947,25.6c6.827,5.973,11.947,15.36,11.947,25.6s-4.267,19.627-11.947,25.6
          c2.56,1.707,4.267,4.267,5.973,7.68c6.827,10.24,6.827,22.187,1.707,34.133c-2.56,5.12-5.973,8.533-10.24,11.947
          c3.413,4.267,5.12,9.387,5.12,15.36v113.493C332.322,485.4,306.721,511,275.148,511z" />
        <path d="M178.721,391.533c0-5.12-3.413-8.533-8.533-8.533c-5.12,0-8.533,3.413-8.533,8.533s3.413,8.533,8.533,8.533
          C175.308,400.067,178.721,396.653,178.721,391.533"/>
        <path d="M272.588,178.2h-51.2c-5.12,0-8.533-3.413-8.533-8.533c0-5.12,3.413-8.533,8.533-8.533h51.2
          c5.12,0,8.533,3.413,8.533,8.533C281.121,174.787,277.708,178.2,272.588,178.2z"/>
        <path d="M272.588,229.4h-51.2c-5.12,0-8.533-3.413-8.533-8.533c0-5.12,3.413-8.533,8.533-8.533h51.2
          c5.12,0,8.533,3.413,8.533,8.533C281.121,225.987,277.708,229.4,272.588,229.4z"/>
        <path d="M272.588,280.6h-51.2c-5.12,0-8.533-3.413-8.533-8.533s3.413-8.533,8.533-8.533h51.2c5.12,0,8.533,3.413,8.533,8.533
          S277.708,280.6,272.588,280.6z"/>
        <path d="M272.588,331.8h-51.2c-5.12,0-8.533-3.413-8.533-8.533c0-5.12,3.413-8.533,8.533-8.533h51.2
          c5.12,0,8.533,3.413,8.533,8.533C281.121,328.387,277.708,331.8,272.588,331.8z"/>
      </g>
    </svg>
  )
}


export const DraggableBottles = ({ data }) => {
  const [list, setList] = useState(data)

  return (
    <div className='flex'>
      {list.map((item) => (
        <div key={item.id || Math.random() * 10}>{item.object}</div>
      ))}
    </div>
  )
}