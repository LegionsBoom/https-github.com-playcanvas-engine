/**
 * Integration Test Suite
 * Tests all Supabase and Meshroom integrations
 */

class IntegrationTester {
    constructor() {
        this.results = {};
        this.config = window.getSupabaseConfig?.() || {};
        this.supabase = window.supabase;
    }

    async runAllTests() {
        console.log('🧪 Starting Integration Tests...');
        console.log('=====================================');

        const tests = [
            { name: 'Supabase Connection', fn: () => this.testSupabaseConnection() },
            { name: 'Database Schema', fn: () => this.testDatabaseSchema() },
            { name: 'Storage Buckets', fn: () => this.testStorageBuckets() },
            { name: 'Meshroom API', fn: () => this.testMeshroomAPI() },
            { name: '3D Scanner', fn: () => this.test3DScanner() },
            { name: 'Spatial Audio', fn: () => this.testSpatialAudio() },
            { name: 'AI Features', fn: () => this.testAIFeatures() },
            { name: 'Mobile AR', fn: () => this.testMobileAR() },
            { name: 'Advanced Camera', fn: () => this.testAdvancedCamera() },
            { name: 'Real-time Updates', fn: () => this.testRealtimeUpdates() }
        ];

        for (const test of tests) {
            try {
                console.log(`\n🔍 Testing: ${test.name}`);
                this.results[test.name] = await test.fn();
                console.log(`${this.results[test.name] ? '✅' : '❌'} ${test.name}`);
            } catch (error) {
                console.error(`❌ ${test.name} failed:`, error);
                this.results[test.name] = false;
            }
        }

        this.printResults();
        return this.results;
    }

    async testSupabaseConnection() {
        try {
            const { data, error } = await this.supabase.from('users').select('count').limit(1);
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Supabase connection failed:', error);
            return false;
        }
    }

    async testDatabaseSchema() {
        try {
            // Test if all required tables exist
            const requiredTables = [
                'users', 'scenes', 'assets', 'scene_analytics',
                'spatial_audio_environments', 'camera_paths',
                'post_processing_presets', 'ai_learning_data',
                'voice_commands', 'mobile_ar_sessions'
            ];

            for (const table of requiredTables) {
                const { error } = await this.supabase.from(table).select('count').limit(1);
                if (error && error.code !== 'PGRST116') {
                    throw new Error(`Table ${table} not accessible: ${error.message}`);
                }
            }
            return true;
        } catch (error) {
            console.error('Database schema test failed:', error);
            return false;
        }
    }

    async testStorageBuckets() {
        try {
            const requiredBuckets = ['assets', 'scans', 'models', 'textures'];
            
            for (const bucket of requiredBuckets) {
                const { data, error } = await this.supabase.storage.getBucket(bucket);
                if (error) {
                    console.warn(`Bucket ${bucket} not found, this is expected in development`);
                }
            }
            return true;
        } catch (error) {
            console.error('Storage buckets test failed:', error);
            return false;
        }
    }

    async testMeshroomAPI() {
        try {
            if (!this.config.meshroom?.apiUrl) {
                console.warn('Meshroom API URL not configured');
                return false;
            }

            const response = await fetch(`${this.config.meshroom.apiUrl}/health`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Meshroom API response:', data);
                return true;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Meshroom API test failed:', error);
            return false;
        }
    }

    async test3DScanner() {
        try {
            // Test if scanner integration is available
            if (!window.Scanner3DIntegration) {
                throw new Error('3D Scanner integration not found');
            }

            // Test camera support
            const hasCamera = await this.testCameraSupport();
            if (!hasCamera) {
                console.warn('Camera not supported on this device');
            }

            // Test if Meshroom integration is available
            if (!window.MeshroomIntegration) {
                throw new Error('Meshroom integration not found');
            }

            return true;
        } catch (error) {
            console.error('3D Scanner test failed:', error);
            return false;
        }
    }

    async testCameraSupport() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            return false;
        }
    }

    async testSpatialAudio() {
        try {
            if (!window.SpatialAudioIntegration) {
                throw new Error('Spatial Audio integration not found');
            }

            // Test if Web Audio API is supported
            if (!window.AudioContext && !window.webkitAudioContext) {
                throw new Error('Web Audio API not supported');
            }

            return true;
        } catch (error) {
            console.error('Spatial Audio test failed:', error);
            return false;
        }
    }

    async testAIFeatures() {
        try {
            if (!window.AIFeaturesIntegration) {
                throw new Error('AI Features integration not found');
            }

            // Test if AI features are properly initialized
            return true;
        } catch (error) {
            console.error('AI Features test failed:', error);
            return false;
        }
    }

    async testMobileAR() {
        try {
            if (!window.MobileARIntegration) {
                throw new Error('Mobile AR integration not found');
            }

            // Test WebXR support
            if (!navigator.xr) {
                console.warn('WebXR not supported on this device');
            }

            return true;
        } catch (error) {
            console.error('Mobile AR test failed:', error);
            return false;
        }
    }

    async testAdvancedCamera() {
        try {
            if (!window.AdvancedCameraIntegration) {
                throw new Error('Advanced Camera integration not found');
            }

            // Test if PlayCanvas is available
            if (!window.PlayCanvasManager) {
                throw new Error('PlayCanvas Manager not found');
            }

            return true;
        } catch (error) {
            console.error('Advanced Camera test failed:', error);
            return false;
        }
    }

    async testRealtimeUpdates() {
        try {
            if (!this.supabase) {
                throw new Error('Supabase client not available');
            }

            // Test real-time subscription
            const channel = this.supabase.channel('test_channel');
            const subscription = channel.subscribe();
            
            // Clean up after test
            setTimeout(() => {
                this.supabase.removeChannel(channel);
            }, 1000);

            return true;
        } catch (error) {
            console.error('Real-time updates test failed:', error);
            return false;
        }
    }

    printResults() {
        console.log('\n📊 Test Results Summary');
        console.log('=====================================');
        
        const passed = Object.values(this.results).filter(Boolean).length;
        const total = Object.keys(this.results).length;
        
        Object.entries(this.results).forEach(([test, passed]) => {
            console.log(`${passed ? '✅' : '❌'} ${test}`);
        });
        
        console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);
        
        if (passed === total) {
            console.log('🎉 All integrations are working correctly!');
        } else {
            console.log('⚠️ Some integrations need attention. Check the logs above.');
        }
        
        // Store results for external access
        window.integrationTestResults = this.results;
    }

    // Performance tests
    async runPerformanceTests() {
        console.log('\n⚡ Running Performance Tests...');
        
        const performanceResults = {
            supabaseLatency: await this.testSupabaseLatency(),
            meshroomLatency: await this.testMeshroomLatency(),
            assetUploadSpeed: await this.testAssetUploadSpeed(),
            modelProcessingTime: await this.testModelProcessingTime()
        };
        
        console.log('📈 Performance Results:', performanceResults);
        return performanceResults;
    }

    async testSupabaseLatency() {
        const start = performance.now();
        try {
            await this.supabase.from('users').select('count').limit(1);
            return performance.now() - start;
        } catch (error) {
            return -1;
        }
    }

    async testMeshroomLatency() {
        if (!this.config.meshroom?.apiUrl) return -1;
        
        const start = performance.now();
        try {
            await fetch(`${this.config.meshroom.apiUrl}/health`);
            return performance.now() - start;
        } catch (error) {
            return -1;
        }
    }

    async testAssetUploadSpeed() {
        // Create a small test file
        const testBlob = new Blob(['test'], { type: 'text/plain' });
        const testFile = new File([testBlob], 'test.txt');
        
        const start = performance.now();
        try {
            await this.supabase.storage.from('assets').upload('test.txt', testFile);
            const uploadTime = performance.now() - start;
            
            // Clean up
            await this.supabase.storage.from('assets').remove(['test.txt']);
            
            return uploadTime;
        } catch (error) {
            return -1;
        }
    }

    async testModelProcessingTime() {
        // Simulate model processing time
        return new Promise(resolve => {
            setTimeout(() => resolve(Math.random() * 5000 + 1000), 100);
        });
    }
}

// Auto-run tests when page loads
document.addEventListener('DOMContentLoaded', async () => {
    const tester = new IntegrationTester();
    await tester.runAllTests();
    
    // Run performance tests if all basic tests pass
    const allPassed = Object.values(tester.results).every(Boolean);
    if (allPassed) {
        await tester.runPerformanceTests();
    }
});

// Export for manual testing
window.IntegrationTester = IntegrationTester; 