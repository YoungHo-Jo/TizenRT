/****************************************************************************
 *
 * Copyright 2018 Samsung Electronics All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 ****************************************************************************/
//===----------------------------------------------------------------------===//
//
//                     The LLVM Compiler Infrastructure
//
// This file is dual licensed under the MIT and the University of Illinois Open
// Source Licenses. See LICENSE.TXT for details.
//
//===----------------------------------------------------------------------===//

// <unordered_map>

// template <class Key, class T, class Hash = hash<Key>, class Pred = equal_to<Key>,
//           class Alloc = allocator<pair<const Key, T>>>
// class unordered_multimap

// pair<const_iterator, const_iterator> equal_range(const key_type& k) const;

#include <unordered_map>
#include <string>
#include <cassert>
#include "libcxx_tc_common.h"

int tc_libcxx_containers_unord_multimap_equal_range_const(void)
{
    {
        typedef std::unordered_multimap<int, std::string> C;
        typedef C::const_iterator I;
        typedef std::pair<int, std::string> P;
        P a[] =
        {
            P(10, "ten"),
            P(20, "twenty"),
            P(30, "thirty"),
            P(40, "forty"),
            P(50, "fifty"),
            P(50, "fiftyA"),
            P(50, "fiftyB"),
            P(60, "sixty"),
            P(70, "seventy"),
            P(80, "eighty"),
        };
        const C c(std::begin(a), std::end(a));
        std::pair<I, I> r = c.equal_range(30);
        TC_ASSERT_EXPR(std::distance(r.first, r.second) == 1);
        TC_ASSERT_EXPR(r.first->first == 30);
        TC_ASSERT_EXPR(r.first->second == "thirty");
        r = c.equal_range(5);
        TC_ASSERT_EXPR(std::distance(r.first, r.second) == 0);
        r = c.equal_range(50);
        TC_ASSERT_EXPR(r.first->first == 50);
        TC_ASSERT_EXPR(r.first->second == "fifty");
        ++r.first;
        TC_ASSERT_EXPR(r.first->first == 50);
        TC_ASSERT_EXPR(r.first->second == "fiftyA");
        ++r.first;
        TC_ASSERT_EXPR(r.first->first == 50);
        TC_ASSERT_EXPR(r.first->second == "fiftyB");
    }
    TC_SUCCESS_RESULT();
    return 0;
}
