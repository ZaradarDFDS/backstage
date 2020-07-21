/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import webpack, { Module, Plugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BundlingOptions, BackendBundlingOptions } from './types';
import { svgrTemplate } from '../svgrTemplate';

type Transforms = {
  loaders: Module['rules'];
  plugins: Plugin[];
};

export const transformsSucrase = (
  options: BundlingOptions | BackendBundlingOptions,
): Transforms => {
  const { isDev } = options;

  const extraTransforms = isDev ? ['react-hot-loader'] : [];

  const loaders = [
    {
      test: /\.(tsx?)$/,
      exclude: /node_modules/,
      loader: require.resolve('@sucrase/webpack-loader'),
      options: {
        transforms: ['typescript', 'jsx', ...extraTransforms],
        production: !isDev,
      },
    },
    {
      test: /\.(jsx?|mjs)$/,
      exclude: /node_modules/,
      loader: require.resolve('@sucrase/webpack-loader'),
      options: {
        transforms: ['jsx', ...extraTransforms],
        production: !isDev,
      },
    },
    {
      test: [/\.icon\.svg$/],
      use: [
        {
          loader: require.resolve('@sucrase/webpack-loader'),
          options: {
            transforms: ['jsx', ...extraTransforms],
            production: !isDev,
          },
        },
        {
          loader: require.resolve('@svgr/webpack'),
          options: { babel: false, template: svgrTemplate },
        },
      ],
    },
    {
      test: [
        /\.bmp$/,
        /\.gif$/,
        /\.jpe?g$/,
        /\.png$/,
        /\.frag/,
        { test: /\.svg/, not: [/\.icon\.svg/] },
        /\.xml/,
      ],
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
    {
      test: /\.ya?ml$/,
      use: require.resolve('yml-loader'),
    },
    {
      include: /\.(md)$/,
      use: require.resolve('raw-loader'),
    },
    {
      test: /\.css$/i,
      use: [
        isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
        {
          loader: require.resolve('css-loader'),
          options: {
            sourceMap: true,
          },
        },
      ],
    },
  ];

  const plugins = new Array<Plugin>();

  if (isDev) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[id].[contenthash:8].css',
      }),
    );
  }

  return { loaders, plugins };
};

export const transformsBabel = (
  options: BundlingOptions | BackendBundlingOptions,
): Transforms => {
  const { isDev } = options;

  const extraTransforms = isDev ? ['react-hot-loader'] : [];

  const loaders = [
    // PRE-change TSX
    // {
    //   test: /\.(tsx?)$/,
    //   exclude: /node_modules/,
    //   loader: require.resolve('@sucrase/webpack-loader'),
    //   options: {
    //     transforms: ['typescript', 'jsx', ...extraTransforms],
    //     production: !isDev,
    //   },
    // },
    // Babel TSX
    {
      test: /\.(tsx?)$/,
      exclude: /node_modules/,
      loader: require.resolve('babel-loader'),
      options: {
        presets: [
          ['@babel/preset-react', {}],
          ['@babel/preset-typescript', {}],
          ['@babel/preset-env', { targets: 'last 2 Chrome versions' }],
        ],
        plugins: [
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-transform-classes',
          [
            '@babel/plugin-proposal-decorators',
            { legacy: false, decoratorsBeforeExport: true },
          ],
        ],
      },
    },
    {
      test: /\.(jsx?|mjs)$/,
      exclude: /node_modules/,
      loader: require.resolve('babel-loader'),
      options: {
        presets: [
          ['@babel/preset-react', {}],
          ['@babel/preset-typescript', {}],
          ['@babel/preset-env', { targets: 'last 2 Chrome versions' }],
        ],
        plugins: [
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-transform-classes',
          [
            '@babel/plugin-proposal-decorators',
            { legacy: false, decoratorsBeforeExport: true },
          ],
        ],
      },
    },
    {
      test: [/\.icon\.svg$/],
      use: [
        {
          loader: require.resolve('@sucrase/webpack-loader'),
          options: {
            transforms: ['jsx', ...extraTransforms],
            production: !isDev,
          },
        },
        {
          loader: require.resolve('@svgr/webpack'),
          options: { babel: false, template: svgrTemplate },
        },
      ],
    },
    {
      test: [
        /\.bmp$/,
        /\.gif$/,
        /\.jpe?g$/,
        /\.png$/,
        /\.frag/,
        { test: /\.svg/, not: [/\.icon\.svg/] },
        /\.xml/,
      ],
      loader: require.resolve('url-loader'),
      options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].[ext]',
      },
    },
    {
      test: /\.ya?ml$/,
      use: require.resolve('yml-loader'),
    },
    {
      include: /\.(md)$/,
      use: require.resolve('raw-loader'),
    },
    {
      test: /\.css$/i,
      use: [
        isDev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
        {
          loader: require.resolve('css-loader'),
          options: {
            sourceMap: true,
          },
        },
      ],
    },
  ];

  const plugins = new Array<Plugin>();

  if (isDev) {
    plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[id].[contenthash:8].css',
      }),
    );
  }

  return { loaders, plugins };
};
