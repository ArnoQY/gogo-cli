// 将所有gulp子任务串成两个大任务

import { task, series, parallel } from 'gulp'

import './init'
import './clean'
import './build'
import './start'
import './icon'

task('start', series('icon', 'start-pack'))

task('build', series(parallel('clean'), 'icon', 'build-pack'))
