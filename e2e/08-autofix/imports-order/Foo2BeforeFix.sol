// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Foo1} from './ThisIsAVeryLongFileOnPurposeToTestTheFirstPathShorterThanTheLastOne.sol';
import '../../../../../token/interfaces/IXTokenWrapper3.sol';
import {IXTokenFactory2} from '../../atoken/interfaces/IXTokenFactory2.sol';
import {Initializable} from './openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '../../../../token/interfaces/FakeContract1.sol';
import '../token/interfaces/IXTokenWrapper.sol';
import {IXTokenFactory, holaquetal} from '../../token/interfaces/IXTokenFactory.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import {FakeContract2} from '../../../token/interfaces/FakeContract2.sol';
import {Afool1} from './Afool1.sol';
import {IXTokenWrapper2} from '../token/interfaces/IXTokenWrapper2.sol';
import {ReentrancyGuardUpgradeable2} from '@Apenzeppelin/ReentrancyGuardUpgradeable2.sol';

contract ImportsOrder2 {
    constructor() {}
}
